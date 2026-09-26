import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    signal,
    Signal,
    ViewChild,
    WritableSignal
} from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { toSignal } from '@angular/core/rxjs-interop';

import { BaseLayoutComponent } from 'src/app/core/components/base-layout/base-layout.component';
import { GroceriesService } from 'src/app/core/services/groceries.service';
import { Groceries, GroceryListProduct, GroceryListRecurringProduct } from 'src/app/core/types/groceries/groceries.type';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { JsonPipe } from '@angular/common';
import { SwipeDirective } from 'src/app/core/directives/swipe.directive';
import { catchError, EMPTY, interval, of, startWith, switchMap } from 'rxjs';
import { ToasterService } from 'src/app/core/services/toaster.service';

@Component({
    templateUrl: './groceries.component.html',
    styleUrls: ['./groceries.component.scss'],
    imports: [BaseLayoutComponent, CdkDrag, CdkDropList, BootstrapIconComponent, CdkDragHandle, JsonPipe, SwipeDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroceriesComponent {
    private readonly groceriesService = inject(GroceriesService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly toasterService = inject(ToasterService);

    productEditingIndex: WritableSignal<number | null> = signal<number | null>(null);
    productEditingValue: WritableSignal<string> = signal<string>('');
    enterPressed: boolean = false;

    recurringProductEditingIndex: WritableSignal<number | null> = signal<number | null>(null);
    recurringProductEditingValue: WritableSignal<string> = signal<string>('');
    recurringProductShowDelete: WritableSignal<boolean> = signal<boolean>(false);
    recurringProductDeleteIndex: WritableSignal<number | null> = signal<number | null>(null);

    groceries: Signal<Groceries> = toSignal(
        interval(5000).pipe(
            startWith(0),
            switchMap(() => {
                if (this.productEditingIndex() !== null || this.recurringProductEditingIndex() !== null) {
                    return of(this.groceries());
                }
                return this.groceriesService.get();
            })
        ),
        { initialValue: { products: [], recurringProducts: [] } }
    );

    products: Signal<GroceryListProduct[]> = computed(() => this.groceries().products);
    recurringProducts: Signal<GroceryListRecurringProduct[]> = computed(() =>
        this.groceries().recurringProducts.filter(rp =>
            this.products()
                .filter(p => p.recurringProduct)
                .every(p => p.name !== rp.name)
        )
    );
    selectedRecurringProducts: Signal<GroceryListRecurringProduct[]> = computed(() =>
        this.groceries().recurringProducts.filter(rp => !this.recurringProducts().includes(rp))
    );

    @ViewChild('productEditInput') productEditInput!: ElementRef<HTMLInputElement>;
    @ViewChild('recurringProductEditInput') recurringProductEditInput!: ElementRef<HTMLInputElement>;

    constructor() {
        // Focus on input field when starting product edit
        effect(() => {
            this.enterPressed = false;
            if (this.productEditingIndex() !== null) {
                setTimeout(() => {
                    return this.productEditInput?.nativeElement.focus();
                });
            }
        });

        // Focus on input field when starting recurring product edit
        effect(() => {
            this.enterPressed = false;
            if (this.recurringProductEditingIndex() !== null) {
                setTimeout(() => {
                    return this.recurringProductEditInput?.nativeElement.focus();
                });
            }
        });
    }

    startEditingProduct(index: number): void {
        const product = this.products().at(index)!;
        this.productEditingValue.set(product.name);
        this.productEditingIndex.set(index);
        this.changeDetectorRef.detectChanges();
    }

    startEditingRecurringProduct(index: number): void {
        const recurringProduct = this.recurringProducts().at(index)!;
        this.recurringProductEditingValue.set(recurringProduct.name);
        this.recurringProductEditingIndex.set(index);
        this.changeDetectorRef.detectChanges();
    }

    saveProductAndCancelEditing(index: number): void {
        // Leaving the field through an enter press fires also the blur event. Prevent this logic from executing.
        if (this.enterPressed) {
            return;
        }

        this.saveProduct(index);
        this.saveGroceriesToDb();
        this.cancelEditingProduct();
    }

    saveRecurringProductAndCancelEditing(index: number): void {
        this.resetDeleteRecurringProduct();

        // Leaving the field through an enter press fires also the blur event. Prevent this logic from executing.
        if (this.enterPressed) {
            return;
        }

        this.saveRecurringProduct(index);
        this.saveGroceriesToDb();
        this.cancelEditingRecurringProduct();
    }

    saveProductAndAddNewProduct(index: number): void {
        this.enterPressed = true;

        this.saveProduct(index);
        this.saveGroceriesToDb();
        const newProductIndex = index + 1;
        this.addNewProduct(newProductIndex);
        this.startEditingProduct(newProductIndex);
    }

    saveRecurringProductAndAddNewProduct(index: number): void {
        this.resetDeleteRecurringProduct();

        this.enterPressed = true;

        this.saveRecurringProduct(index);
        const currentRecurringProductOrder = this.recurringProducts().at(index)!.order;
        const newRecurringProductOrder = currentRecurringProductOrder + 1;
        const newRecurringProductIndex = index + 1;
        // Alle recurring producten (selected en niet selected) hoger dan of gelijk aan newRecurringProductOrder ophogen met 1
        this.recurringProducts().forEach(rp => {
            if (rp.order >= newRecurringProductOrder) {
                rp.order += 1;
            }
        });
        this.selectedRecurringProducts().forEach(rp => {
            if (rp.order >= newRecurringProductOrder) {
                rp.order += 1;
            }
        });
        this.saveGroceriesToDb();
        this.addNewRecurringProduct(newRecurringProductIndex, newRecurringProductOrder);
        this.startEditingRecurringProduct(newRecurringProductIndex);
    }

    addNewProductAndStartEditing(): void {
        const newProductIndex = this.products().length;
        this.addNewProduct(newProductIndex);
        this.startEditingProduct(newProductIndex);
    }

    addNewRecurringProductAndStartEditing(): void {
        this.resetDeleteRecurringProduct();

        const existingRecurringProducts = [...this.recurringProducts(), ...this.recurringProducts()];
        const newRecurringProductOrder =
            existingRecurringProducts.length > 0 ? Math.max(...existingRecurringProducts.map(rp => rp.order)) + 1 : 1;
        const newRecurringProductIndex = this.recurringProducts().length;
        this.addNewRecurringProduct(newRecurringProductIndex, newRecurringProductOrder);
        this.startEditingRecurringProduct(newRecurringProductIndex);
    }

    deleteRecurringProduct(index: number): void {
        this.resetDeleteRecurringProduct();

        const recurringProductOrder = this.recurringProducts().at(index)!.order;
        this.recurringProducts().splice(index, 1);
        // Alle recurring producten (selected en niet selected) hoger dan of gelijk aan newRecurringProductOrder ophogen met 1
        this.recurringProducts().forEach(rp => {
            if (rp.order > recurringProductOrder) {
                rp.order -= 1;
            }
        });
        this.selectedRecurringProducts().forEach(rp => {
            if (rp.order > recurringProductOrder) {
                rp.order -= 1;
            }
        });
        this.saveGroceriesToDb();
    }

    cancelEditingProduct(): void {
        this.productEditingIndex.set(null);
        this.productEditingValue.set('');
        this.enterPressed = false;
    }

    cancelEditingRecurringProduct(): void {
        this.recurringProductEditingIndex.set(null);
        this.recurringProductEditingValue.set('');
        this.enterPressed = false;
    }

    dropProduct(event: CdkDragDrop<string[]>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }

        moveItemInArray(this.products(), event.previousIndex, event.currentIndex);
        this.saveGroceriesToDb();
    }

    dropRecurringProduct(event: CdkDragDrop<string[]>): void {
        this.resetDeleteRecurringProduct();

        if (event.previousIndex === event.currentIndex) {
            return;
        }

        const movedRecurringProduct = this.recurringProducts().at(event.previousIndex)!;
        const movedToRecurringProduct = this.recurringProducts().at(event.currentIndex)!;
        const newOrderForMovedProduct = movedToRecurringProduct.order;

        const movedDown = event.currentIndex - event.previousIndex > 0;

        // Kijk of de tussenliggende items qua volgorde een plek omhoog of omlaag moeten
        const orderDifferenceSurrounding = movedDown ? -1 : 1;

        // Verplaats tussenliggende items omhoog of omlaag, ook die geselecteerd zijn
        this.recurringProducts().forEach((rp, index) => {
            if (
                index !== event.previousIndex &&
                this.mustChangeOrder(movedRecurringProduct.order, movedToRecurringProduct.order, rp.order)
            ) {
                rp.order += orderDifferenceSurrounding;
            }
        });
        this.selectedRecurringProducts().forEach(rp => {
            if (this.mustChangeOrder(movedRecurringProduct.order, movedToRecurringProduct.order, rp.order)) {
                rp.order += orderDifferenceSurrounding;
            }
        });

        // Verander de order waarde van het huidige product
        movedRecurringProduct.order = newOrderForMovedProduct;

        moveItemInArray(this.recurringProducts(), event.previousIndex, event.currentIndex);
        this.saveGroceriesToDb();
    }

    checkProduct(index: number): void {
        const product = this.products().at(index)!;

        if (product.recurringProduct) {
            this.replaceProductInRecurringProducts(product);
        }

        this.products().splice(index, 1);
        this.saveGroceriesToDb();
    }

    checkRecurringProduct(index: number): void {
        this.resetDeleteRecurringProduct();

        const recurringProduct = this.recurringProducts().at(index)!;

        if (!recurringProduct.name) {
            return;
        }

        this.products().push(
            { id: null, rowVersion: null, name: recurringProduct.name, recurringProduct: true, sale: false, albertHeijn: false }
        );
        this.selectedRecurringProducts().push(recurringProduct);
        this.recurringProducts().splice(index, 1);
        this.saveGroceriesToDb();
    }

    onSwipeProductRight(index: number): void {
        const product = this.products().at(index)!;
        product.sale = !product.sale;
        this.saveGroceriesToDb();
    }

    onSwipeProductLeft(index: number): void {
        const product = this.products().at(index)!;
        product.albertHeijn = !product.albertHeijn;
        // TODO
        // this.saveGroceriesToDb();
    }

    onSwipeRecurringProductRight(index: number): void {
        index == this.recurringProductDeleteIndex()
            ? this.recurringProductShowDelete.set(!this.recurringProductShowDelete())
            : this.recurringProductShowDelete.set(true);
        this.recurringProductDeleteIndex.set(index);
    }

    private addNewProduct(index: number): void {
        const newProduct = { id: null, rowVersion: null, name: '', recurringProduct: false, sale: false, albertHeijn: false };
        this.products().splice(index, 0, newProduct);
    }

    private addNewRecurringProduct(index: number, order: number): void {
        const newRecurringProduct = { id: null, rowVersion: null, name: '', order };
        this.recurringProducts().splice(index, 0, newRecurringProduct);
    }

    private saveProduct(index: number): void {
        const product = this.products().at(index)!;
        const newName = this.productEditInput.nativeElement.value.trim();
        if (newName !== product.name) {
            if (product.recurringProduct) {
                this.replaceProductInRecurringProducts(product);
                product.recurringProduct = false;
            }
            product.name = newName;
        }
    }

    private saveRecurringProduct(index: number): void {
        const recurringProduct = this.recurringProducts().at(index)!;
        const newName = this.recurringProductEditInput.nativeElement.value.trim();
        if (newName !== recurringProduct.name) {
            recurringProduct.name = newName;
        }
    }

    private findClosestNegativeIndex(arr: number[]): number {
        let closestIndex = -1;
        let closestDistance = Infinity;

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < 0) {
                const distance = Math.abs(arr[i]);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = i;
                }
            }
        }

        return closestIndex; // Returns -1 if no negative found
    }

    private replaceProductInRecurringProducts(product: GroceryListProduct): void {
        if (!product.recurringProduct) {
            return;
        }

        const recurringProductIndex = this.selectedRecurringProducts().findIndex(rp => rp.name === product.name)!;
        const recurringProduct = this.selectedRecurringProducts().at(recurringProductIndex)!;
        // Replace recurring product so that the recurring product order is maintained.
        const newRecurringProductIndex = Math.max(
            this.findClosestNegativeIndex(this.recurringProducts().map(rp => rp.order - recurringProduct.order)) + 1,
            0
        );
        this.recurringProducts().splice(newRecurringProductIndex, 0, recurringProduct);
        this.selectedRecurringProducts().splice(recurringProductIndex, 1);
    }

    private mustChangeOrder(previousOrder: number, currentOrder: number, itemOrder: number): boolean {
        const movedDown = currentOrder - previousOrder > 0;
        const movedUp = !movedDown;
        const minOrder = Math.min(previousOrder, currentOrder);
        const maxOrder = Math.max(previousOrder, currentOrder);

        if ((movedDown && itemOrder > minOrder && itemOrder <= maxOrder) || (movedUp && itemOrder >= minOrder && itemOrder < maxOrder)) {
            return true;
        }

        return false;
    }

    private resetDeleteRecurringProduct(): void {
        this.recurringProductDeleteIndex.set(null);
        this.recurringProductShowDelete.set(false);
    }

    private saveGroceriesToDb(): void {
        const groceriesToSave: Groceries = {
            products: this.products(),
            recurringProducts: [...this.recurringProducts(), ...this.selectedRecurringProducts()]
        };

        this.groceriesService
            .save(groceriesToSave)
            .pipe(
                catchError(() => {
                    this.toasterService.addAlert({ type: 'danger', msg: 'Opslaan mislukt', timeout: 3000 });

                    return EMPTY;
                })
            )
            .subscribe();
    }
}

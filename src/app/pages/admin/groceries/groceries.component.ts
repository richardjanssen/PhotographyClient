import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, ElementRef, inject, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { toSignal } from '@angular/core/rxjs-interop';

import { BaseLayoutComponent } from 'src/app/core/components/base-layout/base-layout.component';
import { GroceriesService } from 'src/app/core/services/groceries.service';
import { Groceries, GroceryListProduct, GroceryListRecurringProduct } from 'src/app/core/types/groceries/groceries.type';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { JsonPipe } from '@angular/common';
import { SwipeDirective } from 'src/app/core/directives/swipe.directive';

@Component({
    templateUrl: './groceries.component.html',
    styleUrls: ['./groceries.component.scss'],
    imports: [BaseLayoutComponent, CdkDrag, CdkDropList, BootstrapIconComponent, CdkDragHandle, JsonPipe, SwipeDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroceriesComponent {
    private readonly groceriesService = inject(GroceriesService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    groceries: Signal<Groceries> = toSignal(this.groceriesService.get(), { initialValue: { products: [], recurringProducts: [] } });

    products: Signal<GroceryListProduct[]> = computed(() => this.groceries().products);
    recurringProducts: Signal<GroceryListRecurringProduct[]> = computed(() =>
        this.groceries().recurringProducts.filter(rp =>
            this.products()
                .filter(p => p.recurringProduct)
                .every(p => p.name !== rp.name)
        )
    );

    editingIndex: WritableSignal<number | null> = signal<number | null>(null);
    editingValue: WritableSignal<string> = signal<string>('');
    enterPressed: boolean = false;

    @ViewChild('productEditInput') productEditInput!: ElementRef<HTMLInputElement>;

    constructor() {
        effect(() => {
            this.enterPressed = false;
            if (this.editingIndex() !== null) {
                setTimeout(() => {
                    return this.productEditInput?.nativeElement.focus();
                });
            }
        });
    }

    startEditingProduct(index: number): void {
        const product = this.products().at(index)!;
        this.editingValue.set(product.name);
        this.editingIndex.set(index);
        this.changeDetectorRef.detectChanges();
    }

    saveProductAndCancelEditing(index: number): void {
        // Leaving the field through an enter press fires also the blur event. Prevent this logic from executing.
        if(this.enterPressed) {
            return;
        }

        this.saveProduct(index);
        this.cancelEditingProduct();
    }

    saveProductAndAddNewProduct(index: number): void {
        this.enterPressed = true;

        this.saveProduct(index);
        const newProductIndex = index + 1;
        this.addNewProduct(newProductIndex);
        this.startEditingProduct(newProductIndex);
    }

    addNewProductAndStartEditing(): void {
        const newProductIndex = this.products().length;
        this.addNewProduct(newProductIndex);
        this.startEditingProduct(newProductIndex);
    }

    cancelEditingProduct(): void {
        this.editingIndex.set(null);
        this.editingValue.set('');
        this.enterPressed = false;
    }

    dropProduct(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.products(), event.previousIndex, event.currentIndex);
    }

    dropRecurringProduct(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.recurringProducts(), event.previousIndex, event.currentIndex);
    }

    checkProduct(index: number): void {
        const product = this.products().at(index)!;

        if (product.recurringProduct) {
            this.replaceProductInRecurringProducts(product);
        }

        this.products().splice(index, 1);
    }

    checkRecurringProduct(index: number): void {
        const recurringProduct = this.recurringProducts().at(index)!;

        this.products().push({ id: 0, name: recurringProduct.name, recurringProduct: true, sale: false });
        this.recurringProducts().splice(index, 1);
    }

    onSwipeProductRight(index: number): void {
        const product = this.products().at(index)!;
        product.sale = !product.sale;
    }

    private addNewProduct(index: number): void {
        const newProduct = { id: 0, name: '', recurringProduct: false, sale: false };
        this.products().splice(index, 0, newProduct);
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

        const recurringProduct = this.groceries().recurringProducts.find(rp => rp.name === product.name)!;
        // Replace recurring product so that the recurring product order is maintained.
        const newRecurringProductIndex = Math.max(
            this.findClosestNegativeIndex(this.recurringProducts().map(rp => rp.order - recurringProduct.order)) + 1,
            0
        );
        this.recurringProducts().splice(newRecurringProductIndex, 0, recurringProduct);
    }
}

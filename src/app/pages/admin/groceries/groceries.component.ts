import { Component, computed, effect, ElementRef, inject, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { toSignal } from '@angular/core/rxjs-interop';

import { BaseLayoutComponent } from 'src/app/core/components/base-layout/base-layout.component';
import { GroceriesService } from 'src/app/core/services/groceries.service';
import { Groceries, GroceryListProduct, GroceryListRecurringProduct } from 'src/app/core/types/groceries/groceries.type';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { JsonPipe } from '@angular/common';

@Component({
    templateUrl: './groceries.component.html',
    styleUrls: ['./groceries.component.scss'],
    imports: [BaseLayoutComponent, CdkDrag, CdkDropList, BootstrapIconComponent, CdkDragHandle, JsonPipe]
})
export class GroceriesComponent {
    private readonly groceriesService = inject(GroceriesService);

    groceries: Signal<Groceries> = toSignal(this.groceriesService.get(), { initialValue: { products: [], recurringProducts: [] } });

    products: Signal<GroceryListProduct[]> = computed(() => this.groceries().products);
    recurringProducts: Signal<GroceryListRecurringProduct[]> = computed(() =>
        this.groceries().recurringProducts.filter(rp =>
            this.products()
                .filter(p => p.recurringProduct)
                .every(p => p.name !== rp.name)
        )
    );

    editingId: WritableSignal<number | null> = signal<number | null>(null);
    editingValue: WritableSignal<string> = signal<string>('');

    @ViewChild('productEditInput') productEditInput!: ElementRef<HTMLInputElement>;

    constructor() {
        effect(() => {
            if (this.editingId() !== null) {
                setTimeout(() => this.productEditInput?.nativeElement.focus());
            }
        });
    }

    startEditing(product: GroceryListProduct): void {
        this.editingId.set(product.order);
        this.editingValue.set(product.name);
    }

    saveProduct(product: GroceryListProduct): void {
        const newName = this.productEditInput.nativeElement.value.trim();
        if (newName) {
            product.name = newName;
            // TODO: Als dit een recurring product was, en het nieuwe product is geen recurring product, 
            // dan het product op recurringProduct=false zetten 
            // en het oude recurring product terug in de lijst van recurring producten plaatsen
        }
        this.cancelEditing();
    }

    saveProductAndAddNewProduct(product: GroceryListProduct): void {
        const index = this.products().indexOf(product);
        this.saveProduct(product);
        
        // TODO: order van producten opnieuw bepalen.
        const newProduct = { id: 0, name: '', order: 0, recurringProduct: false, sale: false };
        this.products().splice(index + 1, 0, newProduct);
        this.startEditing(newProduct);
    }

    cancelEditing(): void {
        this.editingId.set(null);
        this.editingValue.set('');
    }

    dropProduct(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.products(), event.previousIndex, event.currentIndex);
    }

    dropRecurringProduct(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.recurringProducts(), event.previousIndex, event.currentIndex);
    }

    checkProduct(order: number): void {
        const product = this.products().find(p => p.order === order)!;
        const index = this.products().indexOf(product);

        if (product?.recurringProduct) {
            const recurringProduct = this.groceries().recurringProducts.find(rp => rp.name === product.name)!;
            // Replace recurring product so that the recurring product order is maintained.
            const newRecurringProductIndex = Math.max(
                this.findClosestNegativeIndex(this.recurringProducts().map(rp => rp.order - recurringProduct.order)) + 1,
                0
            );
            this.recurringProducts().splice(newRecurringProductIndex, 0, recurringProduct);
        }

        this.products().splice(index, 1);
    }

    checkRecurringProduct(order: number): void {
        const recurringProduct = this.recurringProducts().find(rp => rp.order === order)!;
        const index = this.recurringProducts().indexOf(recurringProduct);

        const maxOrder = Math.max(...this.products().map(p => p.order));
        this.products().push({ id: 0, name: recurringProduct.name, order: maxOrder + 1, recurringProduct: true, sale: false });
        this.recurringProducts().splice(index, 1);
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

    private updateProductsOrder(): void {
        
    }
}

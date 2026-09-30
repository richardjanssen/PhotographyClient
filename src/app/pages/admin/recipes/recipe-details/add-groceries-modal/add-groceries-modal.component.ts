import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Ingredient, Recipe } from 'src/app/core/types/recipe/recipe.type';

export interface AddGroceriesIngredientForm {
    add: FormControl<boolean>;
    name: FormControl<string>;
}

@Component({
    selector: 'add-groceries-modal',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './add-groceries-modal.component.html'
})
export class AddGroceriesModalComponent implements OnInit {
    private readonly bsModalRef = inject(BsModalRef);

    recipe: Recipe;

    public event: EventEmitter<string[]> = new EventEmitter();

    readonly ingredientsFormArray: FormArray<FormGroup<AddGroceriesIngredientForm>> = new FormArray<FormGroup<AddGroceriesIngredientForm>>(
        []
    );

    constructor() {}
    ngOnInit(): void {
        // Create flat array of unique ingredients
        const ingredients = this.deduplicateBy(
            [...this.recipe.singleIngredients, ...this.recipe.ingredientGroups.flatMap(ig => ig.ingredients)]
            .map(i => ({ ...i, name: this.capitalizeFirstLetter(i.name.trim()) } as Ingredient)),
            'name'
        );

        // Add form group for each ingredient
        ingredients.forEach(i => {
            const form = new FormGroup<AddGroceriesIngredientForm>({
                add: new FormControl<boolean>(i.addToGroceries, { nonNullable: true }),
                name: new FormControl<string>(i.name, { nonNullable: true })
            });

            this.ingredientsFormArray.push(form);
        });
    }

    add(): void {
        const selectedIngredientNames = this.ingredientsFormArray.controls
            .filter(c => c.get('add')!.value === true)
            .map(c => c.get('name')!.value);
        this.event.emit(selectedIngredientNames);
        this.bsModalRef.hide();
    }

    close(): void {
        this.bsModalRef.hide();
    }

    private deduplicateBy<T, K extends keyof T>(arr: T[], key: K): T[] {
        const map = new Map<T[K], T>();
        arr.forEach(item => {
            if (!map.has(item[key])) {
                map.set(item[key], item);
            }
        });
        return Array.from(map.values());
    }

    private capitalizeFirstLetter(text: string): string {
    return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

}

import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Recipe } from 'src/app/core/types/recipe/recipe.type';

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
        const ingredientNames = [...new Set([
            ...this.recipe.singleIngredients.map(i => i.name), 
            ...this.recipe.ingredientGroups.flatMap(ig => ig.ingredients).map(i => i.name)
        ])];

        // Add form group for each ingredient
        ingredientNames.forEach(name => {
            const form = new FormGroup<AddGroceriesIngredientForm>({
                add: new FormControl<boolean>(true, { nonNullable: true }),
                name: new FormControl<string>(name, { nonNullable: true })
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
}

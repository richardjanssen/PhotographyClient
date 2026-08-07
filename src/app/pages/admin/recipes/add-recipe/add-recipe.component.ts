import { Component, input, OnInit } from '@angular/core';

import { RecipeService } from 'src/app/core/services/recipe.service';
import { WindowService } from 'src/app/core/services/window.service';
import { FormArray, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Recipe } from 'src/app/core/types/recipe/recipe.type';
import { BootstrapIconComponent } from "src/app/core/components/bootstrap-icon/bootstrap-icon.component";

export interface IngredientGroupForm {
    name: FormControl<string | null>;
    ingredients: FormArray<FormGroup<IngredientForm>>;
}

export interface IngredientForm {
    id: FormControl<number | null>;
    rowVersion: FormControl<number | null>;
    name: FormControl<string | null>;
    quantity: FormControl<string | null>;
    unit: FormControl<string | null>;
    subgroup: FormControl<string | null>;
}

export interface RecipeForm {
    id: FormControl<number | null>;
    rowVersion: FormControl<number | null>;
    name: FormControl<string>;
    singleIngredients: FormArray<FormGroup<IngredientForm>>;
    preparation: FormControl<string>;
}

@Component({
    selector: 'add-recipe',
    imports: [FormsModule, ReactiveFormsModule, BootstrapIconComponent],
    templateUrl: './add-recipe.component.html',
    styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent implements OnInit {
    recipe = input.required<Recipe>();

    recipeForm: FormGroup<RecipeForm> = new FormGroup<RecipeForm>({
        id: new FormControl<number | null>(null),
        rowVersion: new FormControl<number | null>(null),
        name: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(1)], nonNullable: true }),
        singleIngredients: new FormArray<FormGroup<IngredientForm>>([], Validators.required),
        preparation: new FormControl('', { validators: [Validators.required, Validators.minLength(1)], nonNullable: true })
    });

    ingredientGroupForms: FormArray<FormGroup<IngredientGroupForm>> = new FormArray<FormGroup<IngredientGroupForm>>([]);

    // recipeId: number | null;
    name: string;
    ingredients: string;
    preparation: string;

    submitted: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(private readonly _recipeService: RecipeService, private readonly _windowService: WindowService) {}

    ngOnInit(): void {
        this.patchRecipeForm();
        this.patchIngredientGroupForms();

        console.log(this.recipeForm);
        console.log(this.ingredientGroupForms);
    }

    addSingleIngredient(): void {
        this.ingredientsArray.push(this.giveNewIngredient())
    }

    addIngredientGroup(): void {

    }

    deleteSingleIngredient(index: number): void {
        this.ingredientsArray.removeAt(index);
    }

    get ingredientsArray(): FormArray {
        return this.recipeForm.get('singleIngredients') as FormArray;
    }

    get ingredientGroupFormsArray(): FormArray {
        return this.ingredientGroupForms;
    }

    getIngredientControls(groupIndex: number): FormArray {
        return (this.ingredientGroupForms.at(groupIndex) as FormGroup<IngredientGroupForm>).get('ingredients') as FormArray<
            FormGroup<IngredientForm>
        >;
    }

    get formInvalid(): boolean {
        return !this.name || !this.ingredients || !this.preparation;
    }

    onSubmit(): void {
        this.submitted = true;
        this.saveRecipe();
    }

    reloadComponent(): void {
        this._windowService.reload();
    }

    private patchRecipeForm(): void {
        const ingredientsArray = this.recipeForm.get('singleIngredients') as FormArray<FormGroup<IngredientForm>>;

        if (this.recipe().singleIngredients.length > 0) {
            this.recipe().singleIngredients.forEach(ingredient => {
                ingredientsArray.push(
                    new FormGroup<IngredientForm>({
                        id: new FormControl<number | null>(ingredient.id),
                        rowVersion: new FormControl<number | null>(ingredient.rowVersion),
                        name: new FormControl<string | null>(ingredient.name),
                        quantity: new FormControl<string | null>(ingredient.quantity),
                        unit: new FormControl<string | null>(ingredient.unit),
                        subgroup: new FormControl<string | null>(ingredient.subgroup)
                    })
                );
            });
        } else {
                ingredientsArray.push(this.giveNewIngredient());
        }

        this.recipeForm.patchValue({
            id: this.recipe().id,
            rowVersion: this.recipe().rowVersion,
            name: this.recipe().name,
            singleIngredients: ingredientsArray.value,
            preparation: this.recipe().preparation
        });
    }

    private giveNewIngredient(): FormGroup<IngredientForm> {
        return new FormGroup<IngredientForm>({
                        id: new FormControl<number | null>(null),
                        rowVersion: new FormControl<number | null>(null),
                        name: new FormControl<string | null>(null),
                        quantity: new FormControl<string | null>(null),
                        unit: new FormControl<string | null>(null),
                        subgroup: new FormControl<string | null>(null)
                    });
    }

    private patchIngredientGroupForms(): void {
        this.recipe().ingredientGroups.forEach(group => {
            const form = new FormGroup<IngredientGroupForm>({
                name: new FormControl<string | null>(group.name),
                ingredients: new FormArray<FormGroup<IngredientForm>>([])
            });

            const ingredientsArray = form.get('ingredients') as FormArray;
            group.ingredients.forEach(ingredient => {
                ingredientsArray.push(
                    new FormGroup<IngredientForm>({
                        id: new FormControl<number | null>(ingredient.id),
                        rowVersion: new FormControl<number | null>(ingredient.rowVersion),
                        name: new FormControl<string | null>(ingredient.name),
                        quantity: new FormControl<string | null>(ingredient.quantity),
                        unit: new FormControl<string | null>(ingredient.unit),
                        subgroup: new FormControl<string | null>(ingredient.subgroup)
                    })
                );
            });

            this.ingredientGroupForms.push(form);
        });
    }

    private saveRecipe(): void {
        this._recipeService
            .add({
                id: this.recipe()!.id,
                rowVersion: this.recipe().rowVersion,
                name: this.recipe()!.name,
                singleIngredients: this.recipe()!.singleIngredients,
                ingredientGroups: [],
                preparation: this.recipe()!.preparation
            })
            .subscribe({
                next: () => {
                    this.success = true;
                },
                error: () => {
                    this.error = true;
                }
            });
    }
}

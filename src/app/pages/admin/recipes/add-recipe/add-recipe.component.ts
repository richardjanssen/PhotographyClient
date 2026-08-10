import { Component, input, OnInit } from '@angular/core';

import { RecipeService } from 'src/app/core/services/recipe.service';
import { FormArray, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Recipe } from 'src/app/core/types/recipe/recipe.type';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { Router } from '@angular/router';

export interface IngredientGroupForm {
    name: FormControl<string | null>;
    ingredients: FormArray<FormGroup<IngredientForm>>;
}

export interface IngredientForm {
    id: FormControl<number | null>;
    rowVersion: FormControl<number | null>;
    name: FormControl<string>;
    quantity: FormControl<string | null>;
    unit: FormControl<string | null>;
    subgroup: FormControl<string | null>;
}

export interface RecipeForm {
    id: FormControl<number | null>;
    rowVersion: FormControl<number | null>;
    name: FormControl<string>;
    numberOfPortions: FormControl<number | null>;
    singleIngredients: FormArray<FormGroup<IngredientForm>>;
    preparation: FormControl<string | null>;
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
        numberOfPortions: new FormControl<number | null>(null),
        singleIngredients: new FormArray<FormGroup<IngredientForm>>([]),
        preparation: new FormControl(null)
    });

    ingredientGroupForms: FormArray<FormGroup<IngredientGroupForm>> = new FormArray<FormGroup<IngredientGroupForm>>([]);

    submitted: boolean = false;
    error: boolean = false;

    constructor(private readonly _recipeService: RecipeService, private readonly router: Router) {}

    ngOnInit(): void {
        this.patchRecipeForm();
        this.patchIngredientGroupForms();

        console.log(this.recipeForm);
        console.log(this.ingredientGroupForms);
    }

    addSingleIngredient(): void {
        this.ingredientsArray.push(this.giveNewIngredient());
    }

    addIngredientGroup(): void {
        this.ingredientGroupFormsArray.push(
            new FormGroup<IngredientGroupForm>({
                name: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(1)], nonNullable: true }),
                ingredients: new FormArray<FormGroup<IngredientForm>>([this.giveNewIngredient()])
            })
        );
    }

    removeIngredientGroup(groupIndex: number): void {
        this.ingredientGroupForms.removeAt(groupIndex);
    }

    addIngredientToIngredientGroup(groupIndex: number): void {
        this.getIngredientControls(groupIndex).push(this.giveNewIngredient());
    }

    deleteSingleIngredient(index: number): void {
        this.ingredientsArray.removeAt(index);
    }

    deleteFormGroupIngredient(groupIndex: number, index: number): void {
        this.getIngredientControls(groupIndex).removeAt(index);
    }

    get name(): FormControl<string | null> {
        return this.recipeForm.get('name')! as FormControl<string | null>;
    }

    get numberOfPortions(): FormControl<number | null> {
        return this.recipeForm.get('numberOfPortions')! as FormControl<number | null>;
    }

    singleIngredientName(index: number): FormControl<string | null> {
        const ingredientsArray = this.recipeForm.get('singleIngredients') as FormArray<FormGroup<IngredientForm>>;
        const ingredient = ingredientsArray.at(index);
        return ingredient.get('name')! as FormControl<string | null>;
    }

    groupName(groupIndex: number): FormControl<string> {
        const groupForm = this.ingredientGroupForms.at(groupIndex) as FormGroup<IngredientGroupForm>;
        return groupForm.get('name')! as FormControl<string>;
    }
    groupIngredientName(groupIndex: number, index: number): FormControl<string | null> {
        const ingredientsArray = this.getIngredientControls(groupIndex);
        const ingredient = ingredientsArray.at(index);
        return ingredient.get('name')! as FormControl<string | null>;
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
        return false;
    }

    onSubmit(): void {
        this.error = false;
        this.recipeForm.markAllAsTouched();
        this.ingredientGroupForms.markAllAsTouched();

        if (!this.recipeForm.valid || !this.ingredientGroupForms.valid) {
            return;
        }

        this.saveRecipe();
    }

    private patchRecipeForm(): void {
        const ingredientsArray = this.recipeForm.get('singleIngredients') as FormArray<FormGroup<IngredientForm>>;

        if (this.recipe().singleIngredients.length > 0) {
            this.recipe().singleIngredients.forEach(ingredient => {
                ingredientsArray.push(
                    new FormGroup<IngredientForm>({
                        id: new FormControl<number | null>(ingredient.id),
                        rowVersion: new FormControl<number | null>(ingredient.rowVersion),
                        name: new FormControl<string>(ingredient.name, {
                            validators: [Validators.required, Validators.minLength(1)],
                            nonNullable: true
                        }),
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
            numberOfPortions: this.recipe().numberOfPortions,
            singleIngredients: ingredientsArray.value,
            preparation: this.recipe().preparation
        });
    }

    private giveNewIngredient(): FormGroup<IngredientForm> {
        return new FormGroup<IngredientForm>({
            id: new FormControl<number | null>(null),
            rowVersion: new FormControl<number | null>(null),
            name: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(1)], nonNullable: true }),
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
                        name: new FormControl<string>(ingredient.name, { nonNullable: true }),
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
                name: this.recipeForm.get('name')!.value,
                numberOfPortions: this.recipeForm.get('numberOfPortions')!.value,
                singleIngredients: this.ingredientsArray.controls.map(ingredientForm => {
                    return {
                        id: ingredientForm.get('id')!.value,
                        rowVersion: ingredientForm.get('rowVersion')!.value,
                        name: ingredientForm.get('name')!.value,
                        quantity: ingredientForm.get('quantity')!.value,
                        unit: ingredientForm.get('unit')!.value,
                        subgroup: ingredientForm.get('subgroup')!.value
                    };
                }),
                ingredientGroups: this.ingredientGroupFormsArray.controls.map(ingredientGroupForm => {
                    const ingredientControls = ingredientGroupForm.get('ingredients') as FormArray<FormGroup<IngredientForm>>;

                    return {
                        name: ingredientGroupForm.get('name')!.value,
                        ingredients: ingredientControls.controls.map(ingredientForm => {
                            return {
                                id: ingredientForm.get('id')!.value,
                                rowVersion: ingredientForm.get('rowVersion')!.value,
                                name: ingredientForm.get('name')!.value,
                                quantity: ingredientForm.get('quantity')!.value,
                                unit: ingredientForm.get('unit')!.value,
                                subgroup: ingredientForm.get('subgroup')!.value
                            };
                        })
                    };
                }),
                preparation: this.recipeForm.get('preparation')!.value
            })
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('admin/recepten/overzicht');
                },
                error: () => {
                    this.error = true;
                }
            });
    }
}

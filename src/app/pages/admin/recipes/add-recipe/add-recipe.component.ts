import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { WindowService } from 'src/app/core/services/window.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'add-recipe',
    standalone: true,
    imports: [CommonModule, NgIf, FormsModule],
    templateUrl: './add-recipe.component.html',
    styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent {
    recipeId: number | null;
    name: string;
    ingredients: string;
    preparation: string;

    submitted: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(private readonly _recipeService: RecipeService, private readonly _windowService: WindowService, route: ActivatedRoute) {
        const recipeId = route.snapshot.queryParams['recipeId'];

        if (recipeId) {
            this._recipeService.getRecipe(recipeId).subscribe(recipe => {
                if (recipe) {
                    this.recipeId = recipe.id;
                    this.name = recipe.name;
                    this.ingredients = recipe.ingredients;
                    this.preparation = recipe.preparation;
                }
            });
        }
    }

    get formInvalid(): boolean {
        return !this.name || !this.ingredients || !this.preparation;
    }

    onSubmit(): void {
        this.submitted = true;
        this.recipeId ? this.updateRecipe() : this.addRecipe();
    }

    reloadComponent(): void {
        this._windowService.reload();
    }

    private addRecipe(): void {
        this._recipeService
            .add({
                id: null,
                name: this.name,
                ingredients: this.ingredients,
                preparation: this.preparation
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

    private updateRecipe(): void {
        this._recipeService
            .update({
                id: this.recipeId,
                name: this.name,
                ingredients: this.ingredients,
                preparation: this.preparation
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

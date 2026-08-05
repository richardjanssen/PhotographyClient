import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { Recipe } from 'src/app/core/types/recipe/recipe.type';
import { AddRecipeComponent } from './add-recipe.component';

@Component({
    selector: 'add-recipe-shell',
    imports: [AddRecipeComponent],
    templateUrl: './add-recipe-shell.component.html'
})
export class AddRecipeShellComponent {
    private activatedRoute = inject(ActivatedRoute);
    private recipeService = inject(RecipeService);

    private recipeId: number | undefined = +this.activatedRoute.snapshot.queryParams['recipeId'];
    recipe: Signal<Recipe | null> = toSignal(
        Number.isNaN(this.recipeId) ? of(this.createNewRecipe()) : this.recipeService.getRecipe(this.recipeId!), 
        { initialValue: null }
    )

    private createNewRecipe(): Recipe {
        console.log('here')
        return {
            id: null,
            rowVersion: null,
            name: '',
            singleIngredients: [],
            ingredientGroups: [],
            preparation: ''
        }
    }
}

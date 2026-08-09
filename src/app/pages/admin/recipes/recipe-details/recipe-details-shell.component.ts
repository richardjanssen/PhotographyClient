import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { Recipe } from 'src/app/core/types/recipe/recipe.type';
import { RecipeDetailsComponent } from './recipe-details.component';

@Component({
    selector: 'recipe-details-shell',
    imports: [RecipeDetailsComponent],
    templateUrl: './recipe-details-shell.component.html'
})
export class RecipeDetailsShellComponent {
        private activatedRoute = inject(ActivatedRoute);
    private recipeService = inject(RecipeService);

    private recipeId: number | undefined = +this.activatedRoute.snapshot.queryParams['recipeId'];
    recipe: Signal<Recipe | null> = toSignal(this.recipeService.getRecipe(this.recipeId!), { initialValue: null })
}

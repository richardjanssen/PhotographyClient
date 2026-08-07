import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { RecipeOverview } from 'src/app/core/types/recipe/recipe.type';

@Component({
    selector: 'recipes-overview',
    imports: [],
    templateUrl: './recipes-overview.component.html',
    styleUrls: ['./recipes-overview.component.scss']
})
export class RecipesOverviewComponent {
    private readonly recipeService = inject(RecipeService);
    recipes: Signal<RecipeOverview[]> = toSignal(this.recipeService.getAll(), { initialValue: [] });
    error: boolean = false;
}

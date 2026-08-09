import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RecipeService } from 'src/app/core/services/recipe.service';
import { RecipeOverview } from 'src/app/core/types/recipe/recipe.type';
import { Router } from '@angular/router';

@Component({
    selector: 'recipes-overview',
    imports: [],
    templateUrl: './recipes-overview.component.html',
    styleUrls: ['./recipes-overview.component.scss']
})
export class RecipesOverviewComponent {
    private readonly recipeService = inject(RecipeService);
    private readonly router = inject(Router);
    recipes: Signal<RecipeOverview[]> = toSignal(this.recipeService.getAll(), { initialValue: [] });
    error: boolean = false;

    onRecipeClick(id: number): void {
        this.router.navigate(['admin/recepten/details'], { queryParams: { recipeId: id } });
    }
}

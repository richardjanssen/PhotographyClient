import { Component } from '@angular/core';

import { RecipeService } from 'src/app/core/services/recipe.service';
import { RecipeOverview } from 'src/app/core/types/recipe/recipe.type';
import { RecipeComponent } from '../recipe/recipe.component';
import { HeaderComponent } from '../../home/header/header.component';

@Component({
    selector: 'recipes-overview',
    imports: [RecipeComponent, HeaderComponent],
    templateUrl: './recipes-overview.component.html',
    styleUrls: ['./recipes-overview.component.scss']
})
export class RecipesOverviewComponent {
    recipes: RecipeOverview[] = [];
    error: boolean = false;

    constructor(private readonly _recipeService: RecipeService) {
        this._recipeService.getAll().subscribe({
            next: recipes => (this.recipes = recipes),
            error: () => (this.error = true)
        });
    }
}

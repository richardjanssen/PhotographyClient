import { Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { AddRecipeShellComponent } from './add-recipe/add-recipe-shell.component';
import { RecipesOverviewComponent } from './recipes-overview/recipes-overview.component';
import { RecipeDetailsShellComponent } from './recipe-details/recipe-details-shell.component';

export class RecipesPaths {
    static readonly overview: string = 'overzicht';
    static readonly details: string = 'details';
    static readonly edit: string = 'bewerken';
}

export const RECIPES_ROUTES: Routes = [
    {
        path: '',
        component: RecipesComponent,
        children: [
            { path: '', redirectTo: RecipesPaths.overview, pathMatch: 'full' },
            { path: RecipesPaths.overview, component: RecipesOverviewComponent },
            { path: RecipesPaths.details, component: RecipeDetailsShellComponent },
            { path: RecipesPaths.edit, component: AddRecipeShellComponent }
        ]
    }
];

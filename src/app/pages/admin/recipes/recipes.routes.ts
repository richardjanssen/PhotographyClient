import { Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { AddRecipeShellComponent } from './add-recipe/add-recipe-shell.component';
import { RecipesOverviewComponent } from './recipes-overview/recipes-overview.component';

export class RecipesPaths {
    static readonly overview: string = 'overzicht';
    static readonly add: string = 'toevoegen';
}

export const RECIPES_ROUTES: Routes = [
    {
        path: '',
        component: RecipesComponent,
        children: [
            { path: '', redirectTo: RecipesPaths.overview, pathMatch: 'full' },
            { path: RecipesPaths.overview, component: RecipesOverviewComponent },
            { path: RecipesPaths.add, component: AddRecipeShellComponent }
        ]
    }
];

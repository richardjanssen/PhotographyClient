import { Routes } from '@angular/router';
import { RecipesComponent } from './recipes.component';
import { AddRecipeShellComponent } from './add-recipe/add-recipe-shell.component';

export class RecipesPaths {
    static readonly overview: string = 'overview';
    static readonly add: string = 'add';
}

export const RECIPES_ROUTES: Routes = [
    {
        path: '',
        component: RecipesComponent,
        children: [
            { path: '', redirectTo: RecipesPaths.add, pathMatch: 'full' },
            { path: RecipesPaths.add, component: AddRecipeShellComponent }
        ]
    }
];

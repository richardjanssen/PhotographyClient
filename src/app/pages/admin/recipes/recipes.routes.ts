import { Routes } from '@angular/router';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { RecipesComponent } from './recipes.component';

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
            { path: RecipesPaths.add, component: AddRecipeComponent }
        ]
    }
];

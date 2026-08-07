import { Component } from '@angular/core';
import { AdminPageComponent } from '../admin-page.component';
import { RecipesPaths } from './recipes.routes';

@Component({
    templateUrl: './recipes.component.html',
    imports: [AdminPageComponent]
})
export class RecipesComponent {
    readonly children: { route: string; title: string }[] = [
        { route: RecipesPaths.overview, title: 'Overzicht' },
        { route: RecipesPaths.add, title: 'Nieuw recept' }
    ];
}

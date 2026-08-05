import { Component, Input } from '@angular/core';

import { RecipeOverview } from 'src/app/core/types/recipe/recipe.type';

@Component({
    selector: 'recipe',
    imports: [],
    templateUrl: './recipe.component.html'
})
export class RecipeComponent {
    @Input() recipe: RecipeOverview;

    toggleDetails(): void {
        
    }
}

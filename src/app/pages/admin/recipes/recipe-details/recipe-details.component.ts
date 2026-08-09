import { LowerCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { marked } from 'marked';
import { Recipe } from 'src/app/core/types/recipe/recipe.type';

@Component({
    selector: 'recipe-details',
    imports: [LowerCasePipe],
    templateUrl: './recipe-details.component.html',
    styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent {
    private readonly router = inject(Router);
    
    recipe = input.required<Recipe>();

    parsedPreparation: string;


    ngOnInit(): void {
        this.parsedPreparation = marked.parse(this.recipe().preparation ?? '');
    }

    editRecipe(): void {
        this.router.navigate(['admin/recepten/bewerken'], { queryParams: { recipeId: this.recipe().id } });
    }
    // TODO voor aantal personen toevoegen
}

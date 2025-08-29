import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from 'src/app/core/types/recipe/recipe.type';
import { marked } from 'marked';

@Component({
    selector: 'recipe',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './recipe.component.html'
})
export class RecipeComponent implements OnInit {
    @Input() recipe: Recipe;
    parsedIngredients: string;
    parsedPreparation: string;

    detailsVisible: boolean = false;

    ngOnInit(): void {
        this.parsedIngredients = marked.parse(this.recipe.ingredients);
        this.parsedPreparation = marked.parse(this.recipe.preparation);
    }
    toggleDetails(): void {
        this.detailsVisible = !this.detailsVisible;
    }
}

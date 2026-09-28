import { LowerCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { marked } from 'marked';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Recipe } from 'src/app/core/types/recipe/recipe.type';
import { AddGroceriesModalComponent } from './add-groceries-modal/add-groceries-modal.component';
import { GroceriesService } from 'src/app/core/services/groceries.service';
import { ToasterService } from 'src/app/core/services/toaster.service';

@Component({
    selector: 'recipe-details',
    imports: [LowerCasePipe],
    templateUrl: './recipe-details.component.html',
    styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent {
    private readonly router = inject(Router);
    private readonly modalService = inject(BsModalService);
    private readonly groceriesService = inject(GroceriesService);
    private readonly toasterService = inject(ToasterService);
    private bsModalRef?: BsModalRef;

    recipe = input.required<Recipe>();

    parsedPreparation: string;

    ngOnInit(): void {
        this.parsedPreparation = marked.parse(this.recipe().preparation ?? '');
    }

    editRecipe(): void {
        this.router.navigate(['admin/recepten/bewerken'], { queryParams: { recipeId: this.recipe().id } });
    }

    openAddGroceriesModal(): void {
        const initialState: ModalOptions = {
            initialState: {
                recipe: this.recipe()
            }
        };

        // TODO: Controleren of we niet twee keer subscriben op deze manier
        this.bsModalRef = this.modalService.show(AddGroceriesModalComponent, initialState);
        this.bsModalRef.content.event.subscribe((ingredientNames: string[]) => {
            this.groceriesService
                .addProducts(ingredientNames)
                .subscribe(() =>
                    this.toasterService.addAlert({ type: 'success', msg: 'Ingrediënten toegevoegd aan boodschappenlijst', timeout: 5000 })
                );
        });
    }
}

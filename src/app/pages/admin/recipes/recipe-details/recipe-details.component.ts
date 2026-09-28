import { LowerCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { marked } from 'marked';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Recipe } from 'src/app/core/types/recipe/recipe.type';
import { AddGroceriesModalComponent } from './add-groceries-modal/add-groceries-modal.component';
import { GroceriesService } from 'src/app/core/services/groceries.service';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { DeleteRecipeModalComponent } from './delete-recipe-modal/delete-recipe-modal.component';
import { RecipeService } from 'src/app/core/services/recipe.service';

@Component({
    selector: 'recipe-details',
    imports: [LowerCasePipe, BootstrapIconComponent],
    templateUrl: './recipe-details.component.html',
    styleUrl: './recipe-details.component.scss'
})
export class RecipeDetailsComponent {
    private readonly router = inject(Router);
    private readonly modalService = inject(BsModalService);
    private readonly groceriesService = inject(GroceriesService);
    private readonly recipeService = inject(RecipeService);
    private readonly toasterService = inject(ToasterService);
    private addGroceriesBsModalRef?: BsModalRef;
    private deleteRecipeBsModalRef?: BsModalRef;

    recipe = input.required<Recipe>();

    parsedPreparation: string;

    ngOnInit(): void {
        this.parsedPreparation = marked.parse(this.recipe().preparation ?? '');
    }

    editRecipe(): void {
        this.router.navigate(['admin/recepten/bewerken'], { queryParams: { recipeId: this.recipe().id } });
    }

    openDeleteRecipeModal(): void {
        this.deleteRecipeBsModalRef = this.modalService.show(DeleteRecipeModalComponent);
        this.deleteRecipeBsModalRef.content.event.subscribe(() => {
            this.recipeService.delete(this.recipe().id!).subscribe(() => this.router.navigate(['admin/recepten/overzicht']));
        });
    }

    openAddGroceriesModal(): void {
        const initialState: ModalOptions = {
            initialState: {
                recipe: this.recipe()
            }
        };

        this.addGroceriesBsModalRef = this.modalService.show(AddGroceriesModalComponent, initialState);
        this.addGroceriesBsModalRef.content.event.subscribe((ingredientNames: string[]) => {
            this.groceriesService
                .addProducts(ingredientNames)
                .subscribe(() =>
                    this.toasterService.addAlert({ type: 'success', msg: 'Ingrediënten toegevoegd aan boodschappenlijst', timeout: 5000 })
                );
        });
    }
}

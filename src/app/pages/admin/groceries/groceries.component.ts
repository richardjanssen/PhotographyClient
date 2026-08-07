import { Component } from '@angular/core';
import { RecipesPaths } from './groceries.routes';
import { BaseLayoutComponent } from "src/app/core/components/base-layout/base-layout.component";

@Component({
    templateUrl: './groceries.component.html',
    styleUrls: ['./groceries.component.scss'],
    imports: [BaseLayoutComponent]
})
export class GroceriesComponent {
    readonly children: { route: string; title: string }[] = [{ route: RecipesPaths.add, title: 'Recept toevoegen' }];
}

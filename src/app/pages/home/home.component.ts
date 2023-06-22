import { Component } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { PhotoGridComponent } from './photo-grid/photo-grid.component';
import { HeaderComponent } from './header/header.component';

@Component({
    templateUrl: './home.component.html',
    standalone: true,
    imports: [HeaderComponent, PhotoGridComponent, FooterComponent]
})
export class HomeComponent {}

import { Component } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { PhotoGridComponent } from './photo-grid/photo-grid.component';
import { HeaderComponent } from './header/header.component';
import { PhotosService } from 'src/app/core/services/photos.service';
import { Photo } from 'src/app/core/types/photo.type';
import { NgIf } from '@angular/common';

@Component({
    templateUrl: './home.component.html',
    standalone: true,
    imports: [HeaderComponent, PhotoGridComponent, FooterComponent, NgIf]
})
export class HomeComponent {
    photos: Photo[];

    constructor(readonly photosService: PhotosService) {
        photosService.getPhotos().subscribe(photos => (this.photos = photos));
    }
}

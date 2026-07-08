import { Component } from '@angular/core';
import { FooterComponent } from './footer/footer.component';
import { PhotoGridComponent } from './photo-grid/photo-grid.component';
import { HeaderComponent } from './header/header.component';
import { PhotosService } from 'src/app/core/services/photos.service';
import { Photo } from 'src/app/core/types/photo.type';


@Component({
    templateUrl: './home.component.html',
    imports: [HeaderComponent, PhotoGridComponent, FooterComponent]
})
export class HomeComponent {
    photos: Photo[];

    constructor(readonly photosService: PhotosService) {
        photosService.getPhotos().subscribe(photos => (this.photos = photos));
    }
}

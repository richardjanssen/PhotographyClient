import { Component } from '@angular/core';
import { PhotosService } from 'src/app/core/services/photos.service';
import { Photo } from 'src/app/core/types/photo.type';

@Component({
    templateUrl: './photos-overview.component.html'
})
export class PhotosOverviewComponent {
    photos: Photo[];

    constructor(photosService: PhotosService) {
        photosService.getPhotos().subscribe(photos => (this.photos = photos));
    }
}

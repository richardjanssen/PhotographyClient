import { Component } from '@angular/core';
import { PhotosService } from 'src/app/core/services/photos.service';
import { Photo } from 'src/app/core/types/photo.type';
import { PhotoTableComponent } from '../../../../core/components/photo-table/photo-table.component';
import { NgIf } from '@angular/common';

@Component({
    templateUrl: './homepage-photos.component.html',
    standalone: true,
    imports: [NgIf, PhotoTableComponent]
})
export class HomepagePhotosComponent {
    photos: Photo[];

    constructor(photosService: PhotosService) {
        photosService.getPhotos().subscribe(photos => (this.photos = photos));
    }
}

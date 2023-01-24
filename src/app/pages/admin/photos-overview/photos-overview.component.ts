import { Component } from '@angular/core';
import { PhotosService } from 'src/app/core/services/photos.service';
import { Photo } from 'src/app/core/types/photo.type';

@Component({
    templateUrl: './photos-overview.component.html',
    styleUrls: ['./photos-overview.component.scss']
})
export class PhotosOverviewComponent {
    hasLoaded: boolean = false;
    photos: Photo[];

    constructor(private readonly _photosService: PhotosService) {
        this._photosService.getPhotos().subscribe(photos => {
            this.photos = photos;
            this.hasLoaded = true;
        });
    }
}

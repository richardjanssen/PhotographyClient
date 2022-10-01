import { Component, OnInit } from '@angular/core';
import { PhotosService } from 'src/app/core/services/photos.service';
import { Photo } from 'src/app/core/types/photo.type';

@Component({
  selector: 'app-photos-overview',
  templateUrl: './photos-overview.component.html',
  styleUrls: ['./photos-overview.component.scss']
})
export class PhotosOverviewComponent {
  photos: Photo[];
  
  constructor(private readonly _photosService: PhotosService) { 
    this._photosService.getPhotos().subscribe(photos => this.photos = photos);
  }
}

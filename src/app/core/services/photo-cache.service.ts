import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Photo } from '../types/photo.type';

@Injectable({
    providedIn: 'root'
})
export class PhotoCacheService {
    photos: Photo[];
    activePhotoId: number;
    imageLoadEvent: BehaviorSubject<boolean> = new BehaviorSubject(true);

    cacheAlbumPhotos(photos: Photo[]): void {
        this.photos = photos;
    }

    retrieveAlbumPhotosFromCache(): Photo[] {
        return this.photos;
    }

    retrieveAlbumPhotoFromCache(id: number): Photo | undefined {
        return this.photos.find(p => p.id === id);
    }
}

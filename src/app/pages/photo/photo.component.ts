import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { PhotoCacheService } from 'src/app/core/services/photo-cache.service';
import { Photo } from 'src/app/core/types/photo.type';

@Component({
    selector: 'app-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss']
})
export class PhotoComponent {
    photos: Photo[];
    activeIndex: number;
    activePhotoSrcSet: string;

    constructor(
        private readonly _router: Router,
        private readonly _environmentService: EnvironmentService,
        photoCacheService: PhotoCacheService
    ) {
        this.photos = photoCacheService.retrieveAlbumPhotosFromCache();
        if (!this.photos) {
            this._router.navigateByUrl('/');
        } else {
            this.activeIndex = photoCacheService.activePhotoId ? this.photos.findIndex(p => p.id === photoCacheService.activePhotoId) : 0;
            this.activePhotoSrcSet = this._getActivePhotoSrcSet();
        }
    }

    previousPhoto(): void {
        this.activeIndex = this.activeIndex - 1 < 0 ? this.photos.length - 1 : this.activeIndex - 1;
        this.activePhotoSrcSet = this._getActivePhotoSrcSet();
    }

    nextPhoto(): void {
        this.activeIndex = this.activeIndex + 1 >= this.photos.length ? 0 : this.activeIndex + 1;
        this.activePhotoSrcSet = this._getActivePhotoSrcSet();
    }

    close(): void {
        this._router.navigateByUrl('/');
    }

    private _getActivePhotoSrcSet(): string {
        return this.photos[this.activeIndex].images
            .map(image => `${this._environmentService.baseApiUrl}${image.path} ${image.widthPx}w`)
            .join(',');
    }
}

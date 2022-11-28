import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { PhotoCacheService } from 'src/app/core/services/photo-cache.service';
import { Photo } from 'src/app/core/types/photo.type';

@Component({
    selector: 'app-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit, AfterViewInit {
    @ViewChild('containerCarousel') container: ElementRef;
    image: HTMLImageElement;
    albumPath: string;
    photos: Photo[];
    activeIndex: number;
    activePhotoSrcSet: string;

    footerHeight: number = 40;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        photoCacheService: PhotoCacheService,
        private readonly _environmentService: EnvironmentService
    ) {
        this.route.queryParams.subscribe(() => {
            this.photos = photoCacheService.retrieveAlbumPhotosFromCache();
            if (!this.photos) {
                this.router.navigateByUrl('/');
            } else {
                this.activeIndex = photoCacheService.activePhotoId
                    ? this.photos.findIndex(p => p.id === photoCacheService.activePhotoId)
                    : 0;
                this.activePhotoSrcSet = this._getActivePhotoSrcSet();
            }
        });
    }

    ngOnInit(): void {
        fromEvent(window, 'resize').subscribe(() => {
            this._resizeImage();
        });
    }

    ngAfterViewInit(): void {
        this.image = this.container.nativeElement.querySelector('.image');
        this._resizeImage();
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
        this.router.navigateByUrl('/');
    }

    private _resizeImage(): void {
        this.container.nativeElement.style.height = `${window.innerHeight}px`;
        this.image.style.maxHeight = `${window.innerHeight - 2 * this.footerHeight}px`;
    }

    private _getActivePhotoSrcSet(): string {
        return this.photos[this.activeIndex].images
            .map(image => `${this._environmentService.baseApiUrl}${image.path} ${image.widthPx}w`)
            .join(',');
    }
}

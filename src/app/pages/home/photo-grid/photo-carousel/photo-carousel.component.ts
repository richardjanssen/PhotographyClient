import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Photo } from 'src/app/core/types/photo.type';
import { EnvironmentService } from 'src/app/core/services/environment.service';

@Component({
    selector: 'photo-carousel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './photo-carousel.component.html',
    styleUrls: ['./photo-carousel.component.scss']
})
export class PhotoCarouselComponent implements OnInit {
    photos: Photo[];
    activePhotoId: number;

    activePhotoIndex: number;
    activePhotoSrcSet: string;

    constructor(private readonly _bsModalRef: BsModalRef, private readonly _environmentService: EnvironmentService) {}

    ngOnInit(): void {
        this.activePhotoIndex = this.photos.findIndex(photo => photo.id === this.activePhotoId) ?? 0;
        this.activePhotoSrcSet = this._getActivePhotoSrcSet();
    }

    close(): void {
        this._bsModalRef.hide();
    }

    previousPhoto(): void {
        this.activePhotoIndex = this.activePhotoIndex - 1 < 0 ? this.photos.length - 1 : this.activePhotoIndex - 1;
        this.activePhotoSrcSet = this._getActivePhotoSrcSet();
    }

    nextPhoto(): void {
        this.activePhotoIndex = this.activePhotoIndex + 1 >= this.photos.length ? 0 : this.activePhotoIndex + 1;
        this.activePhotoSrcSet = this._getActivePhotoSrcSet();
    }

    private _getActivePhotoSrcSet(): string {
        return this.photos[this.activePhotoIndex].images
            .map(image => `${this._environmentService.baseApiUrl}${image.path} ${image.widthPx}w`)
            .join(',');
    }
}

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Photo } from '../../types/photo.type';
import { EnvironmentService } from '../../services/environment.service';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { BootstrapIconComponent } from '../bootstrap-icon/bootstrap-icon.component';

@Component({
    selector: 'photo-table',
    templateUrl: './photo-table.component.html',
    styleUrls: ['./photo-table.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, DatePipe, BootstrapIconComponent]
})
export class PhotoTableComponent implements OnChanges {
    @Input() photos: Photo[];
    @Input() showGenerateImageLinks: boolean = false;
    @Input() showDeleteButton: boolean = false;
    @Output() imageHtml: EventEmitter<string> = new EventEmitter();
    @Output() delete: EventEmitter<number> = new EventEmitter();
    tablePhotos: { id: number; date: Date; srcSmall: string; srcText: string; srcLarge: string }[];

    constructor(private readonly _environmentService: EnvironmentService) {}

    ngOnChanges(): void {
        this.tablePhotos = this.photos.map(photo => this.mapPhoto(photo, this._environmentService.baseApiUrl));
    }

    onGenerateImgHtml(srcText: string, srcLarge: string): void {
        this.imageHtml.emit(
            `<a href="${srcLarge}" target="_blank" class="update-text-link">` +
                `<img class="update-text-image" src="${srcText}">` +
                '</a>' +
                '<span class="update-text-image-caption"></span>'
        );
    }

    onDelete(photoId: number): void {
        this.delete.emit(photoId);
    }

    private mapPhoto(photo: Photo, baseApiUrl: string): { id: number; date: Date; srcSmall: string; srcText: string; srcLarge: string } {
        const smallestImage = photo.images.sort((a, b) => a.widthPx - b.widthPx)[0];
        const largestImage = photo.images.sort((a, b) => a.widthPx - b.widthPx).reverse()[0];
        const textImage = photo.images.sort((a, b) => a.widthPx - b.widthPx).find(image => image.widthPx > 810) ?? largestImage;

        return {
            id: photo.id,
            date: photo.date,
            srcSmall: baseApiUrl + smallestImage.path,
            srcText: textImage ? baseApiUrl + textImage.path : baseApiUrl + largestImage.path,
            srcLarge: baseApiUrl + largestImage.path
        };
    }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Photo } from '../../types/photo.type';
import { EnvironmentService } from '../../services/environment.service';
import { NgIf, NgFor, DatePipe } from '@angular/common';

@Component({
    selector: 'photo-table',
    templateUrl: './photo-table.component.html',
    styleUrls: ['./photo-table.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, DatePipe]
})
export class PhotoTableComponent implements OnInit {
    @Input() photos: Photo[];
    @Input() showGenerateImageLinks: boolean = false;
    @Output() imageHtml: EventEmitter<string> = new EventEmitter();
    tablePhotos: { id: number; date: Date; srcSmall: string; srcText: string; srcLarge: string }[];

    constructor(private readonly _environmentService: EnvironmentService) {}

    ngOnInit(): void {
        this.tablePhotos = this.photos.map(photo => this.mapPhoto(photo, this._environmentService.baseApiUrl));
    }

    generateImgHtml(srcText: string, srcLarge: string): void {
        this.imageHtml.emit(
            `<a href="${srcLarge}" target="_blank" class="update-text-link">` +
                `<img class="update-text-image" src="${srcText}">` +
                '</a>' +
                '<span class="update-text-image-caption"></span>'
        );
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

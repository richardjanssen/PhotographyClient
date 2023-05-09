import { Component } from '@angular/core';
import { map } from 'rxjs';
import { AlbumService } from 'src/app/core/services/album.service';
import { HikerUpdateService } from 'src/app/core/services/hiker-update.service';
import { WindowService } from 'src/app/core/services/window.service';
import { Album } from 'src/app/core/types/album.type';
import { HighlightContentType } from 'src/app/core/types/highlight.type';
import { marked } from 'marked';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { Photo } from 'src/app/core/types/photo.type';

@Component({
    selector: 'app-updates',
    templateUrl: './updates.component.html',
    styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent {
    albums: Album[];
    types: { value: HighlightContentType; name: string }[] = [
        { value: HighlightContentType.photo, name: 'Photo' },
        { value: HighlightContentType.blog, name: 'Blog' }
    ];

    title: string;
    type: HighlightContentType;
    albumId: string | null;
    distance: number;
    text: string | null;
    parsedText: string;
    blogPhotos: { id: number; date: Date; srcSmall: string; srcText: string; srcLarge: string }[];
    imageHtml: string;

    submitted: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(
        private readonly _hikerUpdateService: HikerUpdateService,
        private readonly _windowService: WindowService,
        private readonly _albumService: AlbumService,
        private readonly _environmentService: EnvironmentService
    ) {
        this._albumService
            .getAlbums()
            .pipe(map(albums => [{ title: 'No album', id: null }, ...albums]))
            .subscribe(albums => (this.albums = albums));

        this._albumService
            .getById(1)
            .subscribe(
                albumDetails =>
                    (this.blogPhotos = albumDetails.photos.map(photo => this.mapPhoto(photo, this._environmentService.baseApiUrl)))
            );
    }

    get formInvalid(): boolean {
        return !this.title || !this.type || !this.distance;
    }

    onPreview(): void {
        this.parsedText = this.text ? marked.parse(this.text) : '';
    }

    onSubmit(): void {
        this.submitted = true;
        this._hikerUpdateService
            .addUpdate({
                title: this.title,
                type: this.type,
                text: this.text,
                distance: this.distance,
                albumId: this.albumId ? parseInt(this.albumId, 10) : null
            })
            .subscribe({
                next: () => {
                    this.success = true;
                },
                error: () => {
                    this.error = true;
                }
            });
    }

    reloadComponent(): void {
        this._windowService.reload();
    }

    generateImgHtml(srcText: string, srcLarge: string): void {
        this.imageHtml =
            `<a href="${srcLarge}" target="_blank" class="update-text-link">` + `<img class="update-text-image" src="${srcText}"></a>`;
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

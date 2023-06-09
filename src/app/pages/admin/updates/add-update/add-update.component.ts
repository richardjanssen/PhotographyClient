import { Component } from '@angular/core';
import { marked } from 'marked';
import { map } from 'rxjs';
import { AlbumService } from 'src/app/core/services/album.service';
import { HikerUpdateService } from 'src/app/core/services/hiker-update.service';
import { PlaceService } from 'src/app/core/services/place.service';
import { WindowService } from 'src/app/core/services/window.service';
import { Album } from 'src/app/core/types/album.type';
import { HighlightContentType } from 'src/app/core/types/highlight.type';
import { Photo } from 'src/app/core/types/photo.type';
import { Place } from 'src/app/core/types/place.type';

@Component({
    selector: 'add-update',
    templateUrl: './add-update.component.html',
    styleUrls: ['./add-update.component.scss']
})
export class AddUpdateComponent {
    albums: Album[];
    places: Place[];
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
    blogPhotos: Photo[];
    imageHtml: string;

    submitted: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(
        private readonly _hikerUpdateService: HikerUpdateService,
        private readonly _windowService: WindowService,
        albumService: AlbumService,
        placeService: PlaceService
    ) {
        albumService
            .getAlbums()
            .pipe(map(albums => [{ title: 'No album', id: null }, ...albums]))
            .subscribe(albums => (this.albums = albums));

        albumService.getById(1).subscribe(albumDetails => (this.blogPhotos = albumDetails.photos));

        placeService.getAll().subscribe(places => (this.places = places));
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

    onGenerateImgHtml(html: string): void {
        this.imageHtml = html;
    }
}
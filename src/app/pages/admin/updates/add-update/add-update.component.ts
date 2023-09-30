import { Component } from '@angular/core';
import { marked } from 'marked';
import { map } from 'rxjs';
import { AlbumService } from 'src/app/core/services/album.service';
import { HikerUpdateService } from 'src/app/core/services/hiker-update.service';
import { PlaceService } from 'src/app/core/services/place.service';
import { WindowService } from 'src/app/core/services/window.service';
import { Album } from 'src/app/core/types/album.type';
import { PointHighlightType } from 'src/app/core/types/highlight.type';
import { Photo } from 'src/app/core/types/photo.type';
import { Place } from 'src/app/core/types/place.type';
import { PhotoTableComponent } from '../../../../core/components/photo-table/photo-table.component';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'add-update',
    templateUrl: './add-update.component.html',
    styleUrls: ['./add-update.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, NgFor, PhotoTableComponent]
})
export class AddUpdateComponent {
    albums: Album[];
    places: Place[];
    types: { value: PointHighlightType; name: string }[] = [
        { value: PointHighlightType.photo, name: 'Photo' },
        { value: PointHighlightType.blog, name: 'Blog' }
    ];

    updateId: number | null;
    title: string;
    type: PointHighlightType;
    albumId: string | null;
    placeId: string | null;
    distance: number | null;
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
        placeService: PlaceService,
        route: ActivatedRoute
    ) {
        const updateId = route.snapshot.queryParams['updateId'];

        if (updateId) {
            this._hikerUpdateService.getUpdate(updateId).subscribe(update => {
                if (update) {
                    this.updateId = update.id;
                    this.title = update.title;
                    this.type = update.type;
                    this.distance = update.distance;
                    this.albumId = update.albumId?.toString() ?? null;
                    this.placeId = update.placeId?.toString() ?? null;
                    this.text = update.text;
                }
            });
        }

        albumService
            .getAlbums()
            .pipe(map(albums => [{ title: 'No album', id: null }, ...albums]))
            .subscribe(albums => (this.albums = albums));

        albumService.getById(1).subscribe(albumDetails => (this.blogPhotos = albumDetails.photos));

        placeService.getAll().subscribe(places => (this.places = places));
    }

    get formInvalid(): boolean {
        return !this.title || !this.type || (!this.getAlbumId() && !this.text);
    }

    onPreview(): void {
        this.parsedText = this.text ? marked.parse(this.text) : '';
    }

    onSubmit(): void {
        this.submitted = true;
        this.updateId ? this.updateUpdate() : this.addUpdate();
    }

    onPlaceIdChange(placeId: string): void {
        this.distance = this.places.find(place => place.id === parseInt(placeId, 10))?.distance ?? null;
    }

    reloadComponent(): void {
        this._windowService.reload();
    }

    onGenerateImgHtml(html: string): void {
        this.imageHtml = html;
    }

    private getAlbumId(): number | null {
        return this.albumId ? (isNaN(+this.albumId) ? null : parseInt(this.albumId, 10)) : null;
    }

    private addUpdate(): void {
        this._hikerUpdateService
            .add({
                id: null,
                title: this.title,
                type: this.type,
                text: this.text,
                distance: this.distance,
                placeId: this.placeId ? parseInt(this.placeId, 10) : null,
                albumId: this.getAlbumId()
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

    private updateUpdate(): void {
        this._hikerUpdateService
            .update({
                id: this.updateId,
                title: this.title,
                type: this.type,
                text: this.text,
                distance: this.distance,
                placeId: this.placeId ? parseInt(this.placeId, 10) : null,
                albumId: this.getAlbumId()
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
}

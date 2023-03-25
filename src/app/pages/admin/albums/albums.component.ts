import { Component } from '@angular/core';
import { AlbumService } from 'src/app/core/services/album.service';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { WindowService } from 'src/app/core/services/window.service';
import { Album, AlbumDetails } from 'src/app/core/types/album.type';
import { Photo } from 'src/app/core/types/photo.type';

@Component({
    selector: 'app-albums',
    templateUrl: './albums.component.html',
    styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent {
    albums: Album[];
    selectedAlbumId: number;
    selectedAlbumDetails: AlbumDetails;
    selectedAlbumPhotos: { id: number; date: Date; src: string }[];

    albumTitle: string;
    submitted: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(
        private readonly _albumService: AlbumService,
        private readonly _windowService: WindowService,
        private readonly _environmentService: EnvironmentService
    ) {
        this._albumService.getAlbums().subscribe(albums => (this.albums = albums));
    }

    onSubmit(): void {
        this.submitted = true;
        this._albumService.addAlbum({ id: null, title: this.albumTitle }).subscribe({
            next: () => {
                this.success = true;
            },
            error: () => {
                this.error = true;
            }
        });
    }

    onAlbumSelect(): void {
        this._albumService
            .getById(this.selectedAlbumId)
            .subscribe(
                albumDetails =>
                    (this.selectedAlbumPhotos = albumDetails.photos.map(photo => this.mapPhoto(photo, this._environmentService.baseApiUrl)))
            );
    }

    reloadComponent(): void {
        this._windowService.reload();
    }

    private mapPhoto(photo: Photo, baseApiUrl: string): { id: number; date: Date; src: string } {
        const smallestImage = photo.images.sort((a, b) => a.widthPx - b.widthPx)[0];
        return {
            id: photo.id,
            date: photo.date,
            src: baseApiUrl + smallestImage.path
        };
    }
}

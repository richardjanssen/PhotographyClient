import { Component } from '@angular/core';
import { AlbumService } from 'src/app/core/services/album.service';
import { Album, AlbumDetails } from 'src/app/core/types/album.type';

@Component({
    selector: 'albums-overview',
    templateUrl: './albums-overview.component.html',
    styleUrls: ['./albums-overview.component.scss']
})
export class AlbumsOverviewComponent {
    albums: Album[];
    selectedAlbumId: number;
    selectedAlbumDetails: AlbumDetails | null;

    constructor(private readonly _albumService: AlbumService) {
        this._albumService.getAlbums().subscribe(albums => (this.albums = albums));
    }

    onAlbumSelect(): void {
        this.selectedAlbumDetails = null;
        this._albumService.getById(this.selectedAlbumId).subscribe(albumDetails => (this.selectedAlbumDetails = albumDetails));
    }
}

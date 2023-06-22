import { Component } from '@angular/core';
import { AlbumService } from 'src/app/core/services/album.service';
import { Album, AlbumDetails } from 'src/app/core/types/album.type';
import { PhotoTableComponent } from '../../../../core/components/photo-table/photo-table.component';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'albums-overview',
    templateUrl: './albums-overview.component.html',
    styleUrls: ['./albums-overview.component.scss'],
    standalone: true,
    imports: [FormsModule, NgFor, NgIf, PhotoTableComponent]
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

import { Component } from '@angular/core';
import { AlbumService } from 'src/app/core/services/album.service';
import { WindowService } from 'src/app/core/services/window.service';
import { Album } from 'src/app/core/types/album.type';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: 'add-album',
    templateUrl: './add-album.component.html',
    styleUrls: ['./add-album.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule]
})
export class AddAlbumComponent {
    albums: Album[];

    albumTitle: string;
    submitted: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(private readonly _albumService: AlbumService, private readonly _windowService: WindowService) {
        this._albumService.getAlbums().subscribe(albums => (this.albums = albums));
    }

    onSubmit(): void {
        this.submitted = true;
        this._albumService.addAlbum({ title: this.albumTitle }).subscribe({
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
}

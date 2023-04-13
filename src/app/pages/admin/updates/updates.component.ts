import { Component } from '@angular/core';
import { map } from 'rxjs';
import { AlbumService } from 'src/app/core/services/album.service';
import { HikerUpdateService } from 'src/app/core/services/hiker-update.service';
import { WindowService } from 'src/app/core/services/window.service';
import { Album } from 'src/app/core/types/album.type';
import { HighlightContentType } from 'src/app/core/types/highlight.type';

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
    albumId: number | null;
    distance: number;
    text: string | null;

    submitted: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(
        private readonly _hikerUpdateService: HikerUpdateService,
        private readonly _windowService: WindowService,
        private readonly _albumService: AlbumService
    ) {
        this._albumService
            .getAlbums()
            .pipe(map(albums => [{ title: 'No album', id: null }, ...albums]))
            .subscribe(albums => (this.albums = albums));
    }

    get formInvalid(): boolean {
        return !this.title || !this.type || !this.distance;
    }

    onSubmit(): void {
        this.submitted = true;
        this._hikerUpdateService
            .addUpdate({
                title: this.title,
                type: this.type,
                text: this.text,
                distance: this.distance,
                albumId: this.albumId
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
}

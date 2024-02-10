import { Component } from '@angular/core';
import { AdminPageComponent } from '../admin-page.component';
import { AlbumsPaths } from './albums.routes';

@Component({
    templateUrl: './albums.component.html',
    standalone: true,
    imports: [AdminPageComponent]
})
export class AlbumsComponent {
    readonly children: { route: string; title: string }[] = [
        { route: AlbumsPaths.overview, title: 'Overview' },
        { route: AlbumsPaths.add, title: 'Add album' },
        { route: AlbumsPaths.uploadPhoto, title: 'Add photo' }
    ];
}

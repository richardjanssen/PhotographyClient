import { Component } from '@angular/core';
import { ApplicationPaths } from 'src/app/applications-paths';

@Component({
    selector: 'app-albums',
    templateUrl: './albums.component.html'
})
export class AlbumsComponent {
    readonly children: { route: string; title: string }[] = [
        { route: ApplicationPaths.homepagePhotos, title: 'Homepage' },
        { route: ApplicationPaths.albumsOverview, title: 'Overview' },
        { route: ApplicationPaths.addAlbum, title: 'Add album' },
        { route: ApplicationPaths.addPhoto, title: 'Add photo' }
    ];
}

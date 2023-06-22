import { Routes } from '@angular/router';
import { AddAlbumComponent } from './add-album/add-album.component';
import { AddPhotoComponent } from './add-photo/add-photo.component';
import { AlbumsOverviewComponent } from './albums-overview/albums-overview.component';
import { AlbumsComponent } from './albums.component';
import { HomepagePhotosComponent } from './homepage-photos/homepage-photos.component';

export class AlbumsPaths {
    static readonly homepage: string = 'homepage';
    static readonly overview: string = 'overview';
    static readonly add: string = 'add';
    static readonly uploadPhoto: string = 'upload-photo';
}

export const ALBUMS_ROUTES: Routes = [
    {
        path: '',
        component: AlbumsComponent,
        children: [
            { path: '', redirectTo: AlbumsPaths.homepage, pathMatch: 'full' },
            { path: AlbumsPaths.homepage, component: HomepagePhotosComponent },
            { path: AlbumsPaths.overview, component: AlbumsOverviewComponent },
            { path: AlbumsPaths.add, component: AddAlbumComponent },
            { path: AlbumsPaths.uploadPhoto, component: AddPhotoComponent }
        ]
    }
];

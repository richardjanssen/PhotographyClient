import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { ApplicationPaths } from './applications-paths';
import { AuthorizationGuard } from './core/guards/authorization.guard';
import { AddPhotoComponent } from './pages/admin/albums/add-photo/add-photo.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AlbumsComponent } from './pages/admin/albums/albums.component';
import { HomepagePhotosComponent } from './pages/admin/albums/homepage-photos/homepage-photos.component';
import { UpdatesComponent } from './pages/admin/updates/updates.component';
import { HikeComponent } from './pages/hike/hike.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PhotoComponent } from './pages/photo/photo.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { LocationsComponent } from './pages/admin/locations/locations.component';
import { UpdatesOverviewComponent } from './pages/admin/updates/updates-overview/updates-overview.component';
import { AddUpdateComponent } from './pages/admin/updates/add-update/add-update.component';
import { AlbumsOverviewComponent } from './pages/admin/albums/albums-overview/albums-overview.component';
import { AddAlbumComponent } from './pages/admin/albums/add-album/add-album.component';

const routes: Routes = [
    { path: ApplicationPaths.photo, component: PhotoComponent },
    { path: ApplicationPaths.hike, component: HikeComponent },
    { path: ApplicationPaths.login, component: LoginComponent },
    {
        path: ApplicationPaths.admin,
        component: AdminComponent,
        canActivate: [(route: ActivatedRouteSnapshot): boolean | Promise<boolean> => inject(AuthorizationGuard).canActivate(route)],
        data: { roles: ['PhotographyApi_Admin'] },
        children: [
            {
                path: ApplicationPaths.albums,
                component: AlbumsComponent,
                children: [
                    { path: '', redirectTo: ApplicationPaths.homepagePhotos, pathMatch: 'full' },
                    { path: ApplicationPaths.homepagePhotos, component: HomepagePhotosComponent },
                    { path: ApplicationPaths.albumsOverview, component: AlbumsOverviewComponent },
                    { path: ApplicationPaths.addAlbum, component: AddAlbumComponent },
                    { path: ApplicationPaths.addPhoto, component: AddPhotoComponent }
                ]
            },
            {
                path: ApplicationPaths.updates,
                component: UpdatesComponent,
                children: [
                    { path: '', redirectTo: ApplicationPaths.updatesOverview, pathMatch: 'full' },
                    { path: ApplicationPaths.updatesOverview, component: UpdatesOverviewComponent },
                    { path: ApplicationPaths.addUpdate, component: AddUpdateComponent }
                ]
            },
            { path: ApplicationPaths.locations, component: LocationsComponent }
        ]
    },
    { path: ApplicationPaths.unauthorized, component: UnauthorizedComponent },
    { path: '', component: HomeComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthorizationGuard]
})
export class AppRoutingModule {}

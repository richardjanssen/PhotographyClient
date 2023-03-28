import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationPaths } from './applications-paths';
import { AuthorizationGuard } from './core/guards/authorization.guard';
import { AddPhotosComponent } from './pages/admin/add-photos/add-photos.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AlbumsComponent } from './pages/admin/albums/albums.component';
import { PhotosOverviewComponent } from './pages/admin/photos-overview/photos-overview.component';
import { UpdatesComponent } from './pages/admin/updates/updates.component';
import { HikeComponent } from './pages/hike/hike.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PhotoComponent } from './pages/photo/photo.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

const routes: Routes = [
    { path: ApplicationPaths.photo, component: PhotoComponent },
    { path: ApplicationPaths.hike, component: HikeComponent },
    { path: ApplicationPaths.login, component: LoginComponent },
    {
        path: ApplicationPaths.admin,
        component: AdminComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['PhotographyApi_Admin'] },
        children: [
            { path: '', redirectTo: ApplicationPaths.addPhoto, pathMatch: 'full' },
            { path: ApplicationPaths.addPhoto, component: AddPhotosComponent },
            { path: ApplicationPaths.photosOverview, component: PhotosOverviewComponent },
            { path: ApplicationPaths.albums, component: AlbumsComponent },
            { path: ApplicationPaths.updates, component: UpdatesComponent }
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

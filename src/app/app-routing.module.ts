import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationPaths } from './app-paths';
import { AuthorizationGuard } from './core/guards/authorization.guard';
import { AddPhotosComponent } from './pages/admin/add-photos/add-photos.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PhotosOverviewComponent } from './pages/admin/photos-overview/photos-overview.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PhotoComponent } from './pages/photo/photo.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

const routes: Routes = [
    { path: 'photo', component: PhotoComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: ['PhotographyApi_Admin'] },
        children: [
            { path: '', redirectTo: 'add-photo', pathMatch: 'full' },
            { path: 'add-photo', component: AddPhotosComponent },
            { path: 'photos-overview', component: PhotosOverviewComponent }
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

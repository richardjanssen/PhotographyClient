import { Routes } from '@angular/router';
import { HikeComponent } from './pages/hike/hike.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PhotoComponent } from './pages/photo/photo.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

export class AppPaths {
    static readonly photo: string = 'photo';
    static readonly login: string = 'login';
    static readonly admin: string = 'admin';
    static readonly unauthorized: string = 'unauthorized';
    static readonly hike: string = 'hike';
}

export const APP_ROUTES: Routes = [
    { path: AppPaths.photo, component: PhotoComponent },
    { path: AppPaths.hike, component: HikeComponent },
    { path: AppPaths.login, component: LoginComponent },
    {
        path: AppPaths.admin,
        loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    { path: AppPaths.unauthorized, component: UnauthorizedComponent },
    { path: '', component: HomeComponent },
    { path: '**', redirectTo: '' }
];

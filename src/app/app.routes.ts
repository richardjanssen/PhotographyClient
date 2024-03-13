import { Routes } from '@angular/router';
import { HikeComponent } from './pages/hike/hike.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

export class AppPaths {
    static readonly login: string = 'login';
    static readonly admin: string = 'admin';
    static readonly unauthorized: string = 'unauthorized';
    static readonly hike: string = 'hike';
    static readonly photos: string = 'photos';
}

export const APP_ROUTES: Routes = [
    { path: AppPaths.photos, component: HomeComponent },
    { path: AppPaths.login, component: LoginComponent },
    {
        path: AppPaths.admin,
        loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    { path: AppPaths.unauthorized, component: UnauthorizedComponent },
    { path: '', component: HikeComponent },
    { path: '**', redirectTo: '' }
];

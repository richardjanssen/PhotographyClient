import { inject } from '@angular/core';
import { Routes, ActivatedRouteSnapshot } from '@angular/router';
import { AuthorizationGuard } from 'src/app/core/guards/authorization.guard';
import { AdminComponent } from './admin.component';

export class AdminPaths {
    static readonly albums: string = 'albums';
    static readonly updates: string = 'updates';
    static readonly locations: string = 'locations';
    static readonly recipes: string = 'recipes';
    static readonly settings: string = 'settings';
}

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [(route: ActivatedRouteSnapshot): boolean | Promise<boolean> => inject(AuthorizationGuard).canActivate(route)],
        data: { roles: ['PhotographyApi_Admin'] },
        children: [
            {
                path: '',
                redirectTo: AdminPaths.albums,
                pathMatch: 'full'
            },
            {
                path: AdminPaths.albums,
                loadChildren: () => import('./albums/albums.routes').then(m => m.ALBUMS_ROUTES)
            },
            {
                path: AdminPaths.updates,
                loadChildren: () => import('./updates/updates.routes').then(m => m.UPDATES_ROUTES)
            },
            {
                path: AdminPaths.locations,
                loadChildren: () => import('./locations/locations.routes').then(m => m.LOCATIONS_ROUTES)
            },
            {
                path: AdminPaths.recipes,
                loadChildren: () => import('./recipes/recipes.routes').then(m => m.RECIPES_ROUTES)
            },
            {
                path: AdminPaths.settings,
                loadChildren: () => import('./settings/settings.routes').then(m => m.SETTINGS_ROUTES)
            }
        ]
    }
];

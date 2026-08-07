import { Routes } from '@angular/router';
import { AuthorizationGuard } from 'src/app/core/guards/authorization.guard';
import { AdminComponent } from './admin.component';
import { ApplicationRoles } from 'src/app/core/application-roles';

export class AdminPaths {
    static readonly groceries: { path: string; roles: string[]; title: string } = {
        path: 'boodschappen',
        roles: [ApplicationRoles.Riesj_ShoppingListEdit],
        title: 'Boodschappen'
    };
    static readonly recipes: { path: string; roles: string[]; title: string } = {
        path: 'recepten',
        roles: [ApplicationRoles.Riesj_RecipeEdit],
        title: 'Recepten'
    };
    static readonly albums: { path: string; roles: string[]; title: string } = {
        path: 'albums',
        roles: [ApplicationRoles.Riesj_Admin],
        title: 'Albums'
    };
    static readonly locations: { path: string; roles: string[]; title: string } = {
        path: 'pct-locaties',
        roles: [ApplicationRoles.Riesj_Admin],
        title: 'PCT Locaties'
    };
    static readonly updates: { path: string; roles: string[]; title: string } = {
        path: 'pct-updates',
        roles: [ApplicationRoles.Riesj_Admin],
        title: 'PCT Updates'
    };
    static readonly settings: { path: string; roles: string[]; title: string } = {
        path: 'instellingen',
        roles: [ApplicationRoles.Riesj_Admin],
        title: 'Instellingen'
    };
}

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthorizationGuard],
        data: { roles: [ApplicationRoles.Riesj_Admin, ApplicationRoles.Riesj_RecipeEdit, ApplicationRoles.Riesj_ShoppingListEdit] },
        children: [
            {
                path: '',
                redirectTo: AdminPaths.groceries.path,
                pathMatch: 'full'
            },
            {
                path: AdminPaths.groceries.path,
                canActivate: [AuthorizationGuard],
                data: { roles: AdminPaths.groceries.roles },
                loadChildren: () => import('./groceries/groceries.routes').then(m => m.GROCERIES_ROUTES)
            },
            {
                path: AdminPaths.recipes.path,
                canActivate: [AuthorizationGuard],
                data: { roles: AdminPaths.recipes.roles },
                loadChildren: () => import('./recipes/recipes.routes').then(m => m.RECIPES_ROUTES)
            },
            {
                path: AdminPaths.albums.path,
                canActivate: [AuthorizationGuard],
                data: { roles: AdminPaths.albums.roles },
                loadChildren: () => import('./albums/albums.routes').then(m => m.ALBUMS_ROUTES)
            },
            {
                path: AdminPaths.locations.path,
                canActivate: [AuthorizationGuard],
                data: { roles: AdminPaths.locations.roles },
                loadChildren: () => import('./locations/locations.routes').then(m => m.LOCATIONS_ROUTES)
            },
            {
                path: AdminPaths.updates.path,
                canActivate: [AuthorizationGuard],
                data: { roles: AdminPaths.updates.roles },
                loadChildren: () => import('./updates/updates.routes').then(m => m.UPDATES_ROUTES)
            },
            {
                path: AdminPaths.settings.path,
                canActivate: [AuthorizationGuard],
                data: { roles: AdminPaths.settings.roles },
                loadChildren: () => import('./settings/settings.routes').then(m => m.SETTINGS_ROUTES)
            }
        ]
    }
];

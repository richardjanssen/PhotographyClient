import { Routes } from '@angular/router';
import { AddLocationComponent } from './add-location/add-location.component';
import { LocationsOverviewComponent } from './locations-overview/locations-overview.component';
import { LocationsComponent } from './locations.component';

export class LocationsPaths {
    static readonly overview: string = 'overview';
    static readonly add: string = 'add';
}

export const LOCATIONS_ROUTES: Routes = [
    {
        path: '',
        component: LocationsComponent,
        children: [
            { path: '', redirectTo: LocationsPaths.overview, pathMatch: 'full' },
            { path: LocationsPaths.overview, component: LocationsOverviewComponent },
            { path: LocationsPaths.add, component: AddLocationComponent }
        ]
    }
];

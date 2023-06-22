import { Routes } from '@angular/router';
import { AddUpdateComponent } from './add-update/add-update.component';
import { UpdatesOverviewComponent } from './updates-overview/updates-overview.component';
import { UpdatesComponent } from './updates.component';

export class UpdatesPaths {
    static readonly overview: string = 'overview';
    static readonly add: string = 'add';
}

export const UPDATES_ROUTES: Routes = [
    {
        path: '',
        component: UpdatesComponent,
        children: [
            { path: '', redirectTo: UpdatesPaths.overview, pathMatch: 'full' },
            { path: UpdatesPaths.overview, component: UpdatesOverviewComponent },
            { path: UpdatesPaths.add, component: AddUpdateComponent }
        ]
    }
];

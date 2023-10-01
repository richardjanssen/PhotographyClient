import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { UpdateSettingsComponent } from './update-settings/update-settings.component';

export class SettingsPaths {
    static readonly update: string = 'update';
}

export const SETTINGS_ROUTES: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            { path: '', redirectTo: SettingsPaths.update, pathMatch: 'full' },
            { path: SettingsPaths.update, component: UpdateSettingsComponent }
        ]
    }
];

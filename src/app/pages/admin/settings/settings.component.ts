import { Component } from '@angular/core';

import { SettingsPaths } from './settings.routes';
import { AdminPageComponent } from '../admin-page.component';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    imports: [AdminPageComponent]
})
export class SettingsComponent {
    readonly children: { route: string; title: string }[] = [{ route: SettingsPaths.update, title: 'Update' }];
}

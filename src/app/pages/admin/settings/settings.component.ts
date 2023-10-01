import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsPaths } from './settings.routes';
import { AdminPageComponent } from '../admin-page.component';

@Component({
    selector: 'settings',
    standalone: true,
    templateUrl: './settings.component.html',
    imports: [CommonModule, AdminPageComponent]
})
export class SettingsComponent {
    readonly children: { route: string; title: string }[] = [{ route: SettingsPaths.update, title: 'Update' }];
}

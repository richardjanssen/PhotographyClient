import { Component } from '@angular/core';
import { SettingsPaths } from './settings.routes';
import { AdminPageComponent } from '../admin-page.component';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    imports: [AdminPageComponent, JsonPipe]
})
export class SettingsComponent {
    readonly children: { route: string; title: string }[] = [{ route: SettingsPaths.update, title: 'Update' }];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token: any;
    expMilliseconds: number = 0;
    nowMilliseconds: number = 0;
    /**
     *
     */
    constructor(readonly authenticationService: AuthenticationService) {
        this.token = this.authenticationService.decodeToken(authenticationService.getAccessToken()!);
        this.expMilliseconds = this.token.exp * 1000
        this.nowMilliseconds = Date.now();
    }
}

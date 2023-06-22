import { Component } from '@angular/core';
import { ApplicationPaths } from 'src/app/applications-paths';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BaseLayoutComponent } from '../../core/components/base-layout/base-layout.component';
import { HeaderComponent } from '../home/header/header.component';

@Component({
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    standalone: true,
    imports: [HeaderComponent, BaseLayoutComponent, RouterLink, RouterOutlet]
})
export class AdminComponent {
    readonly albumsPath: string = ApplicationPaths.albums;
    readonly updatesPath: string = ApplicationPaths.updates;
    readonly locationsPath: string = ApplicationPaths.locations;

    constructor(private readonly _authenticationService: AuthenticationService) {}

    logout(): void {
        this._authenticationService.logout();
    }
}

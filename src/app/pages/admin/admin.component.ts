import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BaseLayoutComponent } from '../../core/components/base-layout/base-layout.component';
import { HeaderComponent } from '../home/header/header.component';
import { AdminPaths } from './admin.routes';

@Component({
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    standalone: true,
    imports: [HeaderComponent, BaseLayoutComponent, RouterLink, RouterOutlet]
})
export class AdminComponent {
    readonly albumsPath: string = AdminPaths.albums;
    readonly updatesPath: string = AdminPaths.updates;
    readonly locationsPath: string = AdminPaths.locations;

    constructor(private readonly _authenticationService: AuthenticationService) {}

    logout(): void {
        this._authenticationService.logout();
    }
}

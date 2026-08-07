import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BaseLayoutComponent } from '../../core/components/base-layout/base-layout.component';
import { HeaderComponent } from '../home/header/header.component';
import { AdminPaths } from './admin.routes';

@Component({
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    imports: [HeaderComponent, BaseLayoutComponent, RouterLink, RouterOutlet]
})
export class AdminComponent {
    readonly menuEntries: {path: string; roles: string[]; title: string}[] = [];

    constructor(private readonly _authenticationService: AuthenticationService, private readonly router: Router) {
        const userRoles = _authenticationService.getCurrentUser()!.roles;

        this.menuEntries = [
            AdminPaths.groceries, 
            AdminPaths.recipes,
            AdminPaths.albums, 
            AdminPaths.locations, 
            AdminPaths.updates, 
            AdminPaths.settings
        ].filter(p => p.roles.some(r => userRoles.includes(r)));
    }

    logout(): void {
        this._authenticationService.logout().subscribe({
            next: () => {
                this.router.navigateByUrl("");
            }
        });
    }
}

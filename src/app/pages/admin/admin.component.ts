import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication-service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
    constructor(private readonly _authenticationService: AuthenticationService) {}

    logout(): void {
        this._authenticationService.logout();
    }
}

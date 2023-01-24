import { Component } from '@angular/core';
import { ApplicationPaths } from 'src/app/applications-paths';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
    readonly addPhotosPath: string = ApplicationPaths.addPhoto;
    readonly photosOverviewPath: string = ApplicationPaths.photosOverview;

    constructor(private readonly _authenticationService: AuthenticationService) {}

    logout(): void {
        this._authenticationService.logout();
    }
}

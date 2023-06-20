import { Component } from '@angular/core';
import { ApplicationPaths } from 'src/app/applications-paths';

@Component({
    selector: 'locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {
    readonly children: { route: string; title: string }[] = [
        { route: ApplicationPaths.locationsOverview, title: 'Overview' },
        { route: ApplicationPaths.addLocation, title: 'Add location' }
    ];
}

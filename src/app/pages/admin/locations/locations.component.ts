import { Component } from '@angular/core';
import { ApplicationPaths } from 'src/app/applications-paths';
import { AdminPageComponent } from '../admin-page.component';

@Component({
    selector: 'locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss'],
    standalone: true,
    imports: [AdminPageComponent]
})
export class LocationsComponent {
    readonly children: { route: string; title: string }[] = [
        { route: ApplicationPaths.locationsOverview, title: 'Overview' },
        { route: ApplicationPaths.addLocation, title: 'Add location' }
    ];
}

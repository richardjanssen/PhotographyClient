import { Component } from '@angular/core';
import { AdminPageComponent } from '../admin-page.component';
import { LocationsPaths } from './locations.routes';

@Component({
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss'],
    standalone: true,
    imports: [AdminPageComponent]
})
export class LocationsComponent {
    readonly children: { route: string; title: string }[] = [
        { route: LocationsPaths.overview, title: 'Overview' },
        { route: LocationsPaths.add, title: 'Add location' }
    ];
}

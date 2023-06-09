import { Component } from '@angular/core';
import { ApplicationPaths } from 'src/app/applications-paths';

@Component({
    selector: 'app-updates',
    templateUrl: './updates.component.html'
})
export class UpdatesComponent {
    readonly children: { route: string; title: string }[] = [
        { route: ApplicationPaths.updatesOverview, title: 'Overview' },
        { route: ApplicationPaths.addUpdate, title: 'Add update' }
    ];
}

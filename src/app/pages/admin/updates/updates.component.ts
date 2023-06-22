import { Component } from '@angular/core';
import { AdminPageComponent } from '../admin-page.component';
import { UpdatesPaths } from './updates.routes';

@Component({
    selector: 'app-updates',
    templateUrl: './updates.component.html',
    standalone: true,
    imports: [AdminPageComponent]
})
export class UpdatesComponent {
    readonly children: { route: string; title: string }[] = [
        { route: UpdatesPaths.overview, title: 'Overview' },
        { route: UpdatesPaths.add, title: 'Add update' }
    ];
}

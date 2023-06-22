import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-base-layout',
    templateUrl: './base-layout.component.html',
    styleUrls: ['./base-layout.component.scss'],
    standalone: true
})
export class BaseLayoutComponent {
    @HostBinding('class') class = 'base-layout';
}

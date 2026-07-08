import { Component, Input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { BaseLayoutComponent } from '../../core/components/base-layout/base-layout.component';

@Component({
    selector: 'admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    imports: [BaseLayoutComponent, RouterLink, RouterOutlet]
})
export class AdminPageComponent {
    @Input() title: string;
    @Input() children: { route: string; title: string }[];
}

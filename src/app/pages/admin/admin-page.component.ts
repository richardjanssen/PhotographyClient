import { Component, Input } from '@angular/core';

@Component({
    selector: 'admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent {
    @Input() title: string;
    @Input() children: { route: string; title: string }[];
}

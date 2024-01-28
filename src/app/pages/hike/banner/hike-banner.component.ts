import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'hike-banner',
    templateUrl: './hike-banner.component.html',
    styleUrls: ['./hike-banner.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class HikeBannerComponent {
    hasStartedHike: boolean;
    constructor() {
        const startDate = new Date(2024, 3, 15); // 15 April 2024
        if (Date.now() > startDate.valueOf()) {
            this.hasStartedHike = true;
        }
    }
}

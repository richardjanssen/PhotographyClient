import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ConstantsService } from 'src/app/core/services/constants.service';

@Component({
    selector: 'hike-banner',
    templateUrl: './hike-banner.component.html',
    styleUrls: ['./hike-banner.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class HikeBannerComponent {
    hasStartedHike: boolean;
    constructor(constants: ConstantsService) {
        if (Date.now() > constants.pctStartDate.valueOf()) {
            this.hasStartedHike = true;
        }
    }
}

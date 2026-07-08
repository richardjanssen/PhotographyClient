import { Component } from '@angular/core';
import { ConstantsService } from 'src/app/core/services/constants.service';

@Component({
    selector: 'hike-banner',
    templateUrl: './hike-banner.component.html',
    styleUrls: ['./hike-banner.component.scss']
})
export class HikeBannerComponent {
    hasStartedHike: boolean;
    constructor(constants: ConstantsService) {
        if (Date.now() > constants.pctStartDate.valueOf()) {
            this.hasStartedHike = true;
        }
    }
}

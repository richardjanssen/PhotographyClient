import { Component } from '@angular/core';
import { LocationService } from 'src/app/core/services/location.service';
import { PlaceService } from 'src/app/core/services/place.service';
import { WindowService } from 'src/app/core/services/window.service';
import { Place } from 'src/app/core/types/place.type';

@Component({
    selector: 'locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {
    submitted: boolean = false;
    success: boolean = false;
    error: boolean = false;

    distance: number;
    places: Place[];

    constructor(
        private readonly _locationService: LocationService,
        private readonly _windowService: WindowService,
        placeService: PlaceService
    ) {
        placeService.getAll().subscribe(places => (this.places = places));
    }

    get formInvalid(): boolean {
        return !this.distance;
    }

    onSubmit(): void {
        this.submitted = true;
        this._locationService.addManual(this.distance).subscribe({
            next: () => {
                this.success = true;
            },
            error: () => {
                this.error = true;
            }
        });
    }

    reloadComponent(): void {
        this._windowService.reload();
    }
}

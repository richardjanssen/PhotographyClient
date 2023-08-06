import { Component } from '@angular/core';
import { LocationService } from 'src/app/core/services/location.service';
import { PlaceService } from 'src/app/core/services/place.service';
import { WindowService } from 'src/app/core/services/window.service';
import { Place } from 'src/app/core/types/place.type';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'add-location',
    templateUrl: './add-location.component.html',
    styleUrls: ['./add-location.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, NgFor]
})
export class AddLocationComponent {
    submitted: boolean = false;
    success: boolean = false;
    error: boolean = false;

    placeId: number;
    places: Place[];

    constructor(
        private readonly _locationService: LocationService,
        private readonly _windowService: WindowService,
        placeService: PlaceService
    ) {
        placeService.getAll().subscribe(places => (this.places = places));
    }

    get formInvalid(): boolean {
        return !this.placeId;
    }

    onSubmit(): void {
        this.submitted = true;
        this._locationService.addManual(this.placeId).subscribe({
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

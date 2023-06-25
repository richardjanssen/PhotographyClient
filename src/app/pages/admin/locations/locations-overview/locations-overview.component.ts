import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { NullableDisplayPipe } from 'src/app/core/pipes/nullable-display.pipe';
import { LocationService } from 'src/app/core/services/location.service';
import { WindowService } from 'src/app/core/services/window.service';
import { UserLocation } from 'src/app/core/types/location.type';

@Component({
    selector: 'locations-overview',
    templateUrl: './locations-overview.component.html',
    styleUrls: ['./locations-overview.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, DatePipe, NullableDisplayPipe, BootstrapIconComponent]
})
export class LocationsOverviewComponent {
    locations: UserLocation[];
    error: boolean = false;
    deleteError: boolean = false;

    locationToDelete: UserLocation;
    showDeleteConfirmation: boolean;

    constructor(private readonly _locationService: LocationService, private readonly _windowService: WindowService) {
        this._locationService.getAll().subscribe({
            next: locations => (this.locations = locations),
            error: () => (this.error = true)
        });
    }

    onDelete(location: UserLocation): void {
        this.locationToDelete = location;
        this.deleteError = false;
        this.showDeleteConfirmation = true;
    }

    confirmDelete(): void {
        this._locationService.delete(this.locationToDelete.id).subscribe({
            next: () => this.reloadComponent(),
            error: () => (this.deleteError = true)
        });
    }

    cancelDelete(): void {
        this.showDeleteConfirmation = false;
    }

    reloadComponent(): void {
        this._windowService.reload();
    }
}

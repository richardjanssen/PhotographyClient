import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { inspectStatus } from 'src/app/core/helpers/rxjs-operators';
import { NullableDisplayPipe } from 'src/app/core/pipes/nullable-display.pipe';
import { LocationService } from 'src/app/core/services/location.service';
import { WindowService } from 'src/app/core/services/window.service';
import { DataStatus } from 'src/app/core/types/data-status.types';
import { UserLocation } from 'src/app/core/types/location.type';
import { DataStatusPipesModule } from '../../../../core/pipes/status/data-status-pipes.module';

@Component({
    selector: 'locations-overview',
    templateUrl: './locations-overview.component.html',
    styleUrls: ['./locations-overview.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, DatePipe, NullableDisplayPipe, BootstrapIconComponent, AsyncPipe, DataStatusPipesModule]
})
export class LocationsOverviewComponent {
    locations$: Observable<DataStatus<UserLocation[]>>;
    deleteError: boolean = false;

    locationToDelete: UserLocation;
    showDeleteConfirmation: boolean;

    constructor(private readonly _locationService: LocationService, private readonly _windowService: WindowService) {
        this.locations$ = this._locationService.getAll().pipe(inspectStatus());
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

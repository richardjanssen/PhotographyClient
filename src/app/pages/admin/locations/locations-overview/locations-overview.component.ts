import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, ReplaySubject, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { inspectStatus } from 'src/app/core/helpers/rxjs-operators';
import { NullableDisplayPipe } from 'src/app/core/pipes/nullable-display.pipe';
import { LocationService } from 'src/app/core/services/location.service';
import { WindowService } from 'src/app/core/services/window.service';
import { DataStatus, StateStatus } from 'src/app/core/types/data-status.types';
import { UserLocation, UserLocationPlace } from 'src/app/core/types/location.type';
import { DataStatusPipesModule } from '../../../../core/pipes/status/data-status-pipes.module';
import { LoadingMessageComponent } from '../../../../core/components/loading-message/loading-message.component';
import { ErrorMessageComponent } from '../../../../core/components/error-message/error-message.component';
import { PlaceService } from 'src/app/core/services/place.service';
import { DistancePipe } from '../../../../core/pipes/distance.pipe';

@Component({
    selector: 'locations-overview',
    templateUrl: './locations-overview.component.html',
    styleUrls: ['./locations-overview.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        DatePipe,
        NullableDisplayPipe,
        BootstrapIconComponent,
        AsyncPipe,
        DataStatusPipesModule,
        LoadingMessageComponent,
        ErrorMessageComponent,
        DistancePipe
    ]
})
export class LocationsOverviewComponent {
    locations$: Observable<DataStatus<UserLocationPlace[]>>;
    deleted$: ReplaySubject<number | null> = new ReplaySubject<number | null>();
    deleteResult$: Observable<DataStatus<null> | null> = new Observable<null>();
    numberOfItems: number = 50;

    locationToDelete: UserLocation;
    showDeleteConfirmation: boolean;

    constructor(locationService: LocationService, windowService: WindowService, placeService: PlaceService) {
        this.locations$ = combineLatest([locationService.getAll(), placeService.getAll()]).pipe(
            map(([locations, places]) =>
                locations.map(location => {
                    const placeTitle = location.placeId ? places.find(place => place.id === location.placeId)?.title ?? '' : '';
                    return { ...location, place: placeTitle };
                })
            ),
            inspectStatus()
        );
        this.deleteResult$ = this.deleted$.pipe(
            switchMap(placeId =>
                placeId
                    ? locationService.delete(placeId).pipe(
                          inspectStatus(),
                          tap(dataStatus => {
                              if (dataStatus.status === StateStatus.valid) {
                                  windowService.reload();
                              }
                          })
                      )
                    : of(null)
            )
        );
    }

    increaseLocations(maxItems: number): void {
        this.numberOfItems = Math.min(this.numberOfItems + 50, maxItems);
    }

    onPendingDelete(location: UserLocation): void {
        this.locationToDelete = location;
        this.showDeleteConfirmation = true;
    }

    confirmDelete(): void {
        this.deleted$.next(this.locationToDelete.id);
    }

    cancelDelete(): void {
        this.deleted$.next(null);
        this.showDeleteConfirmation = false;
    }
}

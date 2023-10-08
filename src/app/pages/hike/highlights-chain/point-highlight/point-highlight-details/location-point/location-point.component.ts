import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { LocationService } from 'src/app/core/services/location.service';
import { MapboxService } from 'src/app/core/services/mapbox.service';
import { LocationMapComponent } from './map/location-map.component';
import { SettingsService } from 'src/app/core/services/settings.service';
import { inspectStatus } from 'src/app/core/helpers/rxjs-operators';
import { DataStatus } from 'src/app/core/types/data-status.types';
import { ErrorPipe } from '../../../../../../core/pipes/status/error.pipe';
import { ValidPipe } from '../../../../../../core/pipes/status/valid.pipe';
import { DataPipe } from '../../../../../../core/pipes/status/data.pipe';

@Component({
    selector: 'location-point',
    templateUrl: './location-point.component.html',
    standalone: true,
    imports: [AsyncPipe, NgIf, NgClass, LocationMapComponent, ErrorPipe, ValidPipe, DataPipe]
})
export class LocationPointComponent implements OnInit {
    @Input() locationId: number;

    locationData$: Observable<DataStatus<{ token: string; lat: number; lon: number; mapboxEnabled: boolean }>>;

    constructor(
        private readonly _locationService: LocationService,
        private readonly _mapboxService: MapboxService,
        private readonly _settingsService: SettingsService
    ) {}

    ngOnInit(): void {
        this.locationData$ = combineLatest([
            this._locationService.getCoordinateById(this.locationId),
            this._mapboxService.getPublicToken(),
            this._settingsService.get()
        ]).pipe(
            map(([coordinate, token, settings]) => {
                if (coordinate?.lat && coordinate?.lon) {
                    return { token, lat: coordinate.lat, lon: coordinate.lon, mapboxEnabled: settings.mapboxEnabled };
                }
                throw new Error('Coordinate was null');
            }),
            inspectStatus()
        );
    }
}

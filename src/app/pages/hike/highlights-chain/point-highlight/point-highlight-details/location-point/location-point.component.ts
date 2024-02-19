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
import { Coordinate } from 'src/app/core/types/location.type';

@Component({
    selector: 'location-point',
    templateUrl: './location-point.component.html',
    styleUrls: ['./location-point.component.scss'],
    standalone: true,
    imports: [AsyncPipe, NgIf, NgClass, LocationMapComponent, ErrorPipe, ValidPipe, DataPipe]
})
export class LocationPointComponent implements OnInit {
    @Input() locationId: number;

    vm$: Observable<
        DataStatus<{
            token: string;
            currentLocation: Coordinate;
            historicLocations: Coordinate[];
            mapboxEnabled: boolean;
        }>
    >;

    constructor(
        private readonly _locationService: LocationService,
        private readonly _mapboxService: MapboxService,
        private readonly _settingsService: SettingsService
    ) {}

    ngOnInit(): void {
        this.vm$ = combineLatest([
            this._locationService.getMapLocationsById(this.locationId),
            this._mapboxService.getPublicToken(),
            this._settingsService.get()
        ]).pipe(
            map(([mapLocations, token, settings]) => {
                if (mapLocations.currentLocation) {
                    return {
                        token,
                        currentLocation: mapLocations.currentLocation,
                        historicLocations: mapLocations.historicLocations,
                        mapboxEnabled: settings.mapboxEnabled
                    };
                }
                throw new Error('Coordinate was null');
            }),
            inspectStatus()
        );
    }
}

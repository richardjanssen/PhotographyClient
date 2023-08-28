import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { LocationService } from 'src/app/core/services/location.service';
import { MapboxService } from 'src/app/core/services/mapbox.service';
import { LocationMapComponent } from './map/location-map.component';

@Component({
    selector: 'location-point',
    templateUrl: './location-point.component.html',
    standalone: true,
    imports: [NgIf, NgClass, LocationMapComponent]
})
export class LocationPointComponent implements OnInit {
    @Input() locationId: number;
    loaded: boolean;
    error: boolean;

    token: string;
    lat: number;
    lon: number;

    constructor(private readonly _locationService: LocationService, private readonly _mapboxService: MapboxService) {}

    ngOnInit(): void {
        combineLatest([this._locationService.getCoordinateById(this.locationId), this._mapboxService.getPublicToken()]).subscribe({
            next: ([coordinate, token]) => {
                if (coordinate?.lat && coordinate?.lon) {
                    this.token = token;
                    this.lat = coordinate.lat;
                    this.lon = coordinate.lon;
                    this.loaded = true;
                } else {
                    this.error = true;
                }
            },
            error: () => {
                this.error = true;
            }
        });
    }
}

import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, delay } from 'rxjs';
import { LocationService } from 'src/app/core/services/location.service';
import { MapboxService } from 'src/app/core/services/mapbox.service';
import { Coordinate } from 'src/app/core/types/location.type';
import * as mapboxgl from 'mapbox-gl';

@Component({
    selector: 'location-point',
    templateUrl: './location-point.component.html',
    styleUrls: ['./location-point.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass]
})
export class LocationPointComponent implements OnInit {
    @Input() locationId: number;
    map: mapboxgl.Map;
    error: boolean;

    constructor(private readonly _locationService: LocationService, private readonly _mapboxService: MapboxService) {}

    ngOnInit(): void {
        combineLatest([this._locationService.getCoordinateById(this.locationId), this._mapboxService.getPublicToken()]).subscribe({
            next: ([coordinate, token]) => {
                if (coordinate?.lat && coordinate.lon) {
                    this.map = this.createMap(token, coordinate.lat, coordinate.lon);
                } else {
                    this.error = true;
                }
            },
            error: () => {
                this.error = true;
            }
        });
    }

    createMap(token: string, centerLat: number, centerLon: number): mapboxgl.Map {
        const map = new mapboxgl.Map({
            accessToken: token,
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [centerLon, centerLat],
            zoom: 16
        });

        // Add a scale control to the map
        map.addControl(new mapboxgl.ScaleControl());

        return map;
    }
}

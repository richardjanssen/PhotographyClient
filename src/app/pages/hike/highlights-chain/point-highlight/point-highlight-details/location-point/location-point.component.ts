import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { LocationService } from 'src/app/core/services/location.service';
import { MapboxService } from 'src/app/core/services/mapbox.service';
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

    createMap(token: string, lat: number, lon: number): mapboxgl.Map {
        const map = new mapboxgl.Map({
            accessToken: token,
            container: 'map',
            style: 'mapbox://styles/richardjanssen/cllt961gq009o01pj4i4z716f',
            center: [lon, lat],
            zoom: 16
        });

        map.addControl(new mapboxgl.ScaleControl());
        map.addControl(new mapboxgl.NavigationControl());

        map.on('style.load', () => {
            map.addSource('current-location-data', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [lon, lat]
                    },
                    properties: {}
                }
            });

            map.addLayer({
                id: 'current-location',
                type: 'circle',
                source: 'current-location-data',
                paint: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'circle-color': '#be2113',
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'circle-radius': {
                        stops: [
                            [10, 7],
                            [16, 10]
                        ] // 7px at zoom level 10 or lower, 10px at zoom level 16 or higher
                    }
                }
            });
        });

        return map;
    }
}

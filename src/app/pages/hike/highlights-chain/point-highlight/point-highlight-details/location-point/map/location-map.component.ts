import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';
import { Coordinate } from 'src/app/core/types/location.type';

@Component({
    selector: 'location-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './location-map.component.html',
    styleUrls: ['./location-map.component.scss']
})
export class LocationMapComponent implements OnInit {
    @Input() token: string;
    @Input() currentLocation: Coordinate;
    @Input() historicLocations: Coordinate[];

    map: mapboxgl.Map;

    ngOnInit(): void {
        this.map = this.createMap(this.token, this.currentLocation, this.historicLocations);
    }

    private createMap(token: string, currentLocation: Coordinate, historicLocations: Coordinate[]): mapboxgl.Map {
        const map = new mapboxgl.Map({
            accessToken: token,
            container: 'map',
            style: 'mapbox://styles/richardjanssen/cllt961gq009o01pj4i4z716f',
            center: [currentLocation.lon, currentLocation.lat],
            zoom: 14
        });

        map.addControl(new mapboxgl.ScaleControl());
        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.FullscreenControl());

        map.on('style.load', () => {
            map.addSource('current-location-data', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [currentLocation.lon, currentLocation.lat]
                    },
                    properties: {}
                }
            });

            map.addSource('historic-locations-data', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: historicLocations.map(coordinate => [coordinate.lon, coordinate.lat])
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
                            [10, 5],
                            [12, 7],
                            [16, 10]
                        ] // 5px at zoom level 10 or lower, 7px at zoom lever 12, 10px at zoom level 16 or higher
                    }
                }
            });

            map.addLayer({
                id: 'historic-locations',
                type: 'line',
                source: 'historic-locations-data',
                paint: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'line-color': '#be2113',
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'line-width': {
                        stops: [
                            [12, 2],
                            [16, 4]
                        ] // 2px at zoom level 12 or lower, 4px at zoom level 16 or higher
                    }
                }
            });
        });

        return map;
    }
}

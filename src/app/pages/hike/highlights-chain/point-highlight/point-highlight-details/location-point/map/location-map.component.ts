import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';

@Component({
    selector: 'location-map',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './location-map.component.html',
    styleUrls: ['./location-map.component.scss']
})
export class LocationMapComponent implements OnInit {
    @Input() token: string;
    @Input() lat: number;
    @Input() lon: number;

    map: mapboxgl.Map;

    ngOnInit(): void {
        this.map = this.createMap(this.token, this.lat, this.lon);
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

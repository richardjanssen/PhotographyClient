import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LocationService } from 'src/app/core/services/location.service';
import { Coordinate } from 'src/app/core/types/location.type';

@Component({
    selector: 'location-point',
    templateUrl: './location-point.component.html',
    standalone: true,
    imports: [NgIf]
})
export class LocationPointComponent implements OnInit {
    @Input() locationId: number | null;
    coordinate: Coordinate | null;
    hasLoaded: boolean;

    constructor(private readonly _locationService: LocationService) {}

    ngOnInit(): void {
        if (this.locationId !== null) {
            this._locationService.getCoordinateById(this.locationId).subscribe(coordinate => {
                this.coordinate = coordinate;
                this.hasLoaded = true;
            });
        }
    }
}

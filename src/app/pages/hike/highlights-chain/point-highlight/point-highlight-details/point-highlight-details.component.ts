import { Component, Input } from '@angular/core';
import { Constants } from 'src/app/core/constants';
import { PointHighlightType, PointHighlight } from 'src/app/core/types/highlight.type';
import { LocationPointComponent } from './location-point/location-point.component';
import { PhotosHighlightComponent } from './photos-highlight/photos-highlight.component';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
    selector: 'point-highlight-details',
    templateUrl: './point-highlight-details.component.html',
    styleUrls: ['./point-highlight-details.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, NgSwitch, NgSwitchCase, PhotosHighlightComponent, LocationPointComponent]
})
export class PointHighlightDetailsComponent {
    @Input() highlight: PointHighlight;

    pointHighlightType = PointHighlightType;
    expandableHighlightTypes = [...Constants.expandableHighlightTypes, PointHighlightType.location];
}

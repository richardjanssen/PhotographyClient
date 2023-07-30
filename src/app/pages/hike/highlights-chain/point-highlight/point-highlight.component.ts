import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Constants } from 'src/app/core/constants';
import { PointHighlight } from 'src/app/core/types/highlight.type';
import { PointHighlightDetailsComponent } from './point-highlight-details/point-highlight-details.component';
import { PointHighlightSummaryComponent } from './point-highlight-summary/point-highlight-summary.component';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'point-highlight',
    templateUrl: './point-highlight.component.html',
    styleUrls: ['./point-highlight.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf, PointHighlightSummaryComponent, PointHighlightDetailsComponent]
})
export class PointHighlightComponent implements OnInit {
    @Input() highlight: PointHighlight;
    @Input() sectionIndex: number | null;
    @Input() inSection: boolean = false;
    @HostBinding('class.expanded') expanded: boolean = false;
    @HostBinding('class.resizing') resizing: boolean = false;
    expandable: boolean;

    ngOnInit(): void {
        this.expandable = Constants.expandableHighlightTypes.includes(this.highlight.placeType);
    }

    toggleExpansion(): void {
        if (!this.expandable) {
            return;
        }

        this.resizing = !this.resizing;
        this.expanded = !this.expanded;
    }
}

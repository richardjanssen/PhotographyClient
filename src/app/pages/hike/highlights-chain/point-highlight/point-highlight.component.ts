import { Component, Input, OnInit } from '@angular/core';
import { Constants } from 'src/app/core/constants';
import { PointHighlight, PointHighlightType } from 'src/app/core/types/highlight.type';
import { PointHighlightDetailsComponent } from './point-highlight-details/point-highlight-details.component';
import { PointHighlightSummaryComponent } from './point-highlight-summary/point-highlight-summary.component';
import { NgClass, NgIf } from '@angular/common';
import { BootstrapIconComponent } from '../../../../core/components/bootstrap-icon/bootstrap-icon.component';

@Component({
    selector: 'point-highlight',
    templateUrl: './point-highlight.component.html',
    styleUrls: ['./point-highlight.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf, PointHighlightSummaryComponent, PointHighlightDetailsComponent, BootstrapIconComponent]
})
export class PointHighlightComponent implements OnInit {
    @Input() highlight: PointHighlight;

    expanded: boolean;
    expandable: boolean;

    ngOnInit(): void {
        this.expandable = Constants.expandableHighlightTypes.includes(this.highlight.type);
        this.expanded = this.highlight.type === PointHighlightType.location;
    }

    toggleExpansion(): void {
        if (!this.expandable) {
            return;
        }

        this.expanded = !this.expanded;
    }
}

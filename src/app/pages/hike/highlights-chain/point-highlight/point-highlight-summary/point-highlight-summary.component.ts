import { HighlightContentType, PointHighlight } from 'src/app/core/types/highlight.type';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'point-highlight-summary',
    templateUrl: './point-highlight-summary.component.html',
    styleUrls: ['./point-highlight-summary.component.scss']
})
export class PointHighlightSummaryComponent implements OnInit {
    @Input() highlight: PointHighlight;
    @Input() expandable: boolean;
    fixedHeightTitle: boolean;

    pointHighlightType: typeof HighlightContentType = HighlightContentType;

    ngOnInit(): void {
        this.fixedHeightTitle = this.highlight.points.length > 1 && this.highlight.points.some(point => point.title.length > 20);
    }
}

import { Component, Input } from '@angular/core';
import { HighlightContentType, PointHighlight } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'point-highlight-details',
    templateUrl: './point-highlight-details.component.html',
    styleUrls: ['./point-highlight-details.component.scss']
})
export class PointHighlightDetailsComponent {
    @Input() highlight: PointHighlight;

    pointHighlightType: typeof HighlightContentType = HighlightContentType;
}

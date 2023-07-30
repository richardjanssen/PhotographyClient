import { HighlightContentType, PointHighlight } from 'src/app/core/types/highlight.type';
import { Component, Input } from '@angular/core';
import { IconComponent } from '../../../../../core/components/icon/icon.component';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, DatePipe } from '@angular/common';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { DistancePipe } from '../../../../../core/pipes/distance.pipe';

@Component({
    selector: 'point-highlight-summary',
    templateUrl: './point-highlight-summary.component.html',
    styleUrls: ['./point-highlight-summary.component.scss'],
    standalone: true,
    imports: [NgIf, NgSwitch, NgSwitchCase, IconComponent, BootstrapIconComponent, NgSwitchDefault, DatePipe, DistancePipe]
})
export class PointHighlightSummaryComponent {
    @Input() highlight: PointHighlight;
    @Input() expandable: boolean;

    pointHighlightType: typeof HighlightContentType = HighlightContentType;
}

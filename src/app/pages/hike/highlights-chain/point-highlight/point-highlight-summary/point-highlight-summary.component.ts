import { PointHighlightType, PointHighlight } from 'src/app/core/types/highlight.type';
import { Component, Input } from '@angular/core';
import { IconComponent } from '../../../../../core/components/icon/icon.component';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { DistancePipe } from '../../../../../core/pipes/distance.pipe';
import { PctTimePipe } from '../../../../../core/pipes/pct-time.pipe';
import { PctDatePipe } from '../../../../../core/pipes/pct-date.pipe';

@Component({
    selector: 'point-highlight-summary',
    templateUrl: './point-highlight-summary.component.html',
    styleUrls: ['./point-highlight-summary.component.scss'],
    standalone: true,
    imports: [NgIf, NgSwitch, NgSwitchCase, IconComponent, BootstrapIconComponent, NgSwitchDefault, DistancePipe, PctTimePipe, PctDatePipe]
})
export class PointHighlightSummaryComponent {
    @Input() highlight: PointHighlight;

    pointHighlightType = PointHighlightType;
}

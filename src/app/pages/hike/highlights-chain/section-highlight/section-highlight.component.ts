import { Component, Input } from '@angular/core';
import { SectionHighlight } from 'src/app/core/types/highlight.type';
import { PointHighlightComponent } from '../point-highlight/point-highlight.component';
import { IconComponent } from '../../../../core/components/icon/icon.component';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { DistancePipe } from 'src/app/core/pipes/distance.pipe';

@Component({
    selector: 'section-highlight',
    templateUrl: './section-highlight.component.html',
    styleUrls: ['./section-highlight.component.scss'],
    standalone: true,
    imports: [IconComponent, BootstrapIconComponent, DistancePipe, DatePipe, NgIf, NgFor, PointHighlightComponent]
})
export class SectionHighlightComponent {
    @Input() highlight: SectionHighlight;
}

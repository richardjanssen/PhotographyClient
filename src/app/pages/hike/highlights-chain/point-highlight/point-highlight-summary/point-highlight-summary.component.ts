import { HighlightContentType, PointHighlight } from 'src/app/core/types/highlight.type';
import { Component, Input, OnInit } from '@angular/core';
import { IconComponent } from '../../../../../core/components/icon/icon.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgIf, NgTemplateOutlet, NgFor, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
    selector: 'point-highlight-summary',
    templateUrl: './point-highlight-summary.component.html',
    styleUrls: ['./point-highlight-summary.component.scss'],
    standalone: true,
    imports: [NgIf, NgTemplateOutlet, CarouselModule, NgFor, NgClass, NgSwitch, NgSwitchCase, IconComponent, NgSwitchDefault]
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

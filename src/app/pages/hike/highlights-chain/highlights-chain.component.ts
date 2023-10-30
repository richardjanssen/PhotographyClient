import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Highlight, HighlightType } from 'src/app/core/types/highlight.type';
import { SectionHighlightComponent } from './section-highlight/section-highlight.component';
import { PointHighlightComponent } from './point-highlight/point-highlight.component';
import { IconComponent } from '../../../core/components/icon/icon.component';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';

@Component({
    selector: 'highlights-chain',
    templateUrl: './highlights-chain.component.html',
    styleUrls: ['./highlights-chain.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        IconComponent,
        NgFor,
        NgSwitch,
        NgSwitchCase,
        PointHighlightComponent,
        NgClass,
        SectionHighlightComponent,
        BootstrapIconComponent
    ]
})
export class HighlightsChainComponent {
    @Input() highlights: Highlight[];

    highlightType: typeof HighlightType = HighlightType;
    numberOfHighlights: number = 15;

    onViewMoreHighlights(): void {
        this.numberOfHighlights = Math.min(this.numberOfHighlights + 15, this.highlights.length);
    }
}

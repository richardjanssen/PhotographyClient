import { Component, Input } from '@angular/core';
import { SectionHighlight } from 'src/app/core/types/highlight.type';
import { PointHighlightComponent } from '../point-highlight/point-highlight.component';
import { IconComponent } from '../../../../core/components/icon/icon.component';
import { NgFor } from '@angular/common';

@Component({
    selector: 'section-highlight',
    templateUrl: './section-highlight.component.html',
    styleUrls: ['./section-highlight.component.scss'],
    standalone: true,
    imports: [IconComponent, NgFor, PointHighlightComponent]
})
export class SectionHighlightComponent {
    @Input() highlight: SectionHighlight;
}

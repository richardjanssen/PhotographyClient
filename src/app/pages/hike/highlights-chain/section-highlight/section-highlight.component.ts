import { Component, Input, OnInit } from '@angular/core';
import { StyleService } from 'src/app/core/services/style.service';
import { AlignmentType, HighlightExpansion, SectionHighlight } from 'src/app/core/types/highlight.type';
import { PointHighlightComponent } from '../point-highlight/point-highlight.component';
import { IconComponent } from '../../../../core/components/icon/icon.component';
import { NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'section-highlight',
    templateUrl: './section-highlight.component.html',
    styleUrls: ['./section-highlight.component.scss'],
    standalone: true,
    imports: [NgClass, IconComponent, NgFor, PointHighlightComponent]
})
export class SectionHighlightComponent implements OnInit {
    @Input() highlight: SectionHighlight;
    @Input() alignment: AlignmentType;

    private expandedPointHighlights: number[] = [];

    expanded: boolean;
    resizing: boolean;

    alignmentType: typeof AlignmentType = AlignmentType;

    constructor(private readonly _styleService: StyleService) {}

    ngOnInit(): void {}

    trackHighlightExpansion(expansion: HighlightExpansion): void {
        if (expansion.isExpanded) {
            this.expandedPointHighlights.push(expansion.pointIndex);
        } else {
            this.expandedPointHighlights = this.expandedPointHighlights.filter(index => index !== expansion.pointIndex);
        }
        this.toggleSectionExpansion();
    }

    private toggleSectionExpansion(): void {
        // If at least one child is expanded and section is not currently expanded, then expand section
        // Collapse section when there are no expanded childs
        if (this.expandedPointHighlights.length > 0) {
            if (!this.expanded) {
                this.resizing = true;
                this.expanded = true;
                setTimeout(() => {
                    this.resizing = false;
                }, this._styleService.transitionTimeMs);
            }
        } else {
            this.resizing = true;
            this.expanded = false;
            setTimeout(() => {
                this.resizing = false;
            }, this._styleService.transitionTimeMs);
        }
    }
}

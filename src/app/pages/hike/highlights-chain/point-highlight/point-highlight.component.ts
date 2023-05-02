import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Constants } from 'src/app/core/constants';
import { StyleService } from 'src/app/core/services/style.service';
import { HighlightExpansion, PointHighlight } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'point-highlight',
    templateUrl: './point-highlight.component.html',
    styleUrls: ['./point-highlight.component.scss']
})
export class PointHighlightComponent implements OnInit {
    @Input() highlight: PointHighlight;
    @Input() sectionIndex: number | null;
    @Input() inSection: boolean = false;
    @HostBinding('class.expanded') expanded: boolean = false;
    @HostBinding('class.resizing') resizing: boolean = false;
    expandable: boolean;
    @Output() expansion: EventEmitter<HighlightExpansion> = new EventEmitter();

    constructor(private readonly _styleService: StyleService) {}

    ngOnInit(): void {
        this.expandable = this.highlight.points.some(point => Constants.expandableHighlightTypes.includes(point.placeType));
    }

    toggleExpansion(): void {
        if (!this.expandable) {
            return;
        }

        this.resizing = !this.resizing;
        this.expanded = !this.expanded;

        if (this.sectionIndex) {
            this.expansion.emit({ pointIndex: this.highlight.highlightIndex, isExpanded: this.expanded });
        }

        setTimeout(() => {
            this.resizing = !this.resizing;
        }, this._styleService.transitionTimeMs);
    }
}

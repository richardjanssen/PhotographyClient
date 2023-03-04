import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { StyleService } from 'src/app/core/services/style.service';
import { Highlight, HighlightContentType, HighlightExpansion } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'app-highlight',
    templateUrl: './highlight.component.html',
    styleUrls: ['./highlight.component.scss']
})
export class HighlightComponent implements OnInit {
    @Input() highlight: Highlight;
    @Input() inSection: boolean = false;
    @HostBinding('class.expanded') expanded: boolean = false;
    @HostBinding('class.resizing') resizing: boolean = false;
    expandable: boolean;
    @Output() expansion: EventEmitter<HighlightExpansion> = new EventEmitter();

    highlightContentType: typeof HighlightContentType = HighlightContentType;
    expandableHighlightTypes: HighlightContentType[] = [HighlightContentType.photos, HighlightContentType.town];

    constructor(private readonly _styleService: StyleService) {}

    ngOnInit(): void {
        this.expandable = this.expandableHighlightTypes.includes(this.highlight.contentType);
    }

    toggleExpansion(): void {
        if (!this.expandable) {
            return;
        }

        this.resizing = !this.resizing;
        this.expanded = !this.expanded;

        this.expansion.emit({ id: this.highlight.id, isExpanded: this.expanded });
        setTimeout(() => {
            this.resizing = !this.resizing;
        }, this._styleService.transitionTimeMs);
    }
}

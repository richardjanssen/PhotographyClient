import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { StyleService } from 'src/app/core/services/style.service';
import { Highlight, HighlightContentType } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'app-highlight',
    templateUrl: './highlight.component.html',
    styleUrls: ['./highlight.component.scss']
})
export class HighlightComponent implements OnInit {
    @Input() highlight: Highlight;
    @HostBinding('class.expanded') expanded: boolean = false;
    resizing: boolean = false;
    expandable: boolean;

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

        setTimeout(() => {
            this.resizing = !this.resizing;
        }, this._styleService.transitionTimeMs);
    }
}

import { Component } from '@angular/core';
import { HightlightService } from 'src/app/core/services/highlight.service';
import { Highlight } from 'src/app/core/types/highlight.type';

@Component({
    templateUrl: './hike.component.html',
    styleUrls: ['./hike.component.scss']
})
export class HikeComponent {
    highlights: Highlight[];

    constructor(readonly highlightService: HightlightService) {
        highlightService.getHighlights().subscribe(result => {
            this.highlights = result;
        });
    }
}

import { Component } from '@angular/core';
import { HightlightService } from 'src/app/core/services/highlight.service';
import { Highlight } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'app-highlights-slider',
    templateUrl: './highlights-slider.component.html',
    styleUrls: ['./highlights-slider.component.scss']
})
export class HighlightsSliderComponent {
    highlights: Highlight[];

    constructor(readonly highlightService: HightlightService) {
        highlightService.getHighlights().subscribe(result => (this.highlights = result));
    }
}

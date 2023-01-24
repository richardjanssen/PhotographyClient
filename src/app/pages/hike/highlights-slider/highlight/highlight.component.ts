import { Component, Input } from '@angular/core';
import { Highlight } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'app-highlight',
    templateUrl: './highlight.component.html',
    styleUrls: ['./highlight.component.scss']
})
export class HighlightComponent {
    @Input() highlight: Highlight;
}

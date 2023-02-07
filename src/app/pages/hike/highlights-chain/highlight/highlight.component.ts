import { Component, HostBinding, Input } from '@angular/core';
import { Highlight } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'app-highlight',
    templateUrl: './highlight.component.html',
    styleUrls: ['./highlight.component.scss']
})
export class HighlightComponent {
    @HostBinding('class.clicked') get clicked(): boolean {
        return this.isClicked;
    }
    @Input() highlight: Highlight;

    isClicked: boolean = false;

    onClick(): void {
        this.isClicked = !this.isClicked;
    }
}

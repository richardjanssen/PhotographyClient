import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Highlight } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'app-highlight',
    templateUrl: './highlight.component.html',
    styleUrls: ['./highlight.component.scss']
})
export class HighlightComponent implements AfterViewInit {
    @ViewChild('title') title: ElementRef;
    @ViewChild('titleContainer') titleContainer: ElementRef;
    @ViewChild('titleSpacerLeft') titleSpacerLeft: ElementRef;
    @ViewChild('titleSpacerRight') titleSpacerRight: ElementRef;
    @Input() highlight: Highlight;
    spacerWidth: number = 0;

    constructor(private readonly _changeDetectorRef: ChangeDetectorRef) {}

    ngAfterViewInit(): void {
        const originalHeight = this.titleContainer.nativeElement.offsetHeight;

        while (originalHeight === this.titleContainer.nativeElement.offsetHeight) {
            ++this.spacerWidth;
            this._changeDetectorRef.detectChanges();
        }

        --this.spacerWidth;
        --this.spacerWidth; // Needs to be done twice due to some rounding weirdness
        this._changeDetectorRef.detectChanges();
    }
}

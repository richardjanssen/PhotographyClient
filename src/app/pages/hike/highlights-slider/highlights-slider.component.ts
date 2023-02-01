import { AfterViewInit, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { fromEvent } from 'rxjs';
import { HightlightService } from 'src/app/core/services/highlight.service';
import { Highlight } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'app-highlights-slider',
    templateUrl: './highlights-slider.component.html',
    styleUrls: ['./highlights-slider.component.scss']
})
export class HighlightsSliderComponent implements AfterViewInit {
    @ViewChild('highlightsChain') highlightsChain: ElementRef;
    @ViewChildren('highlightContainer') highlightContainers: QueryList<ElementRef>;
    @ViewChildren('highlightConnector') highlightConnectors: QueryList<ElementRef>;

    highlights: Highlight[];
    private readonly centerpointLeftRelativePosition = 0.4;
    private readonly centerpointRightRelativePosition = 0.6;
    private readonly centerpointRelativeDistance = this.centerpointRightRelativePosition - this.centerpointLeftRelativePosition;

    constructor(readonly highlightService: HightlightService, private renderer: Renderer2) {
        highlightService.getHighlights().subscribe(result => (this.highlights = result));
    }

    ngOnInit(): void {
        fromEvent(window, 'resize').subscribe(() => {
            this.setConnectorsWidth();
        });
    }

    ngAfterViewInit(): void {
        this.positionAndSizeLine();
    }

    positionAndSizeLine() {
        const containerWidth = this.highlightsChain.nativeElement.offsetWidth;
        const centerpointLeft = this.centerpointLeftRelativePosition * containerWidth;
        const centerpointRight = this.centerpointRightRelativePosition * containerWidth;

        this.highlightContainers.forEach((highlightContainer, index) => {
            const width = highlightContainer.nativeElement.offsetWidth;
            const marginLeftPx = index % 2 === 0 ? centerpointLeft - width * 0.5 : centerpointRight - width * 0.5;
            highlightContainer.nativeElement.style.marginLeft = `${(marginLeftPx / containerWidth) * 100}%`;

            const connector = this.highlightConnectors.get(index);
            if (connector) {
                this.renderer.addClass(connector.nativeElement, index % 2 === 0 ? 'connector--left-to-right' : 'connector--right-to-left');
                this.setConnectorWidth(connector, containerWidth);
            }
        });
    }

    private setConnectorsWidth(): void {
        const containerWidth = this.highlightsChain.nativeElement.offsetWidth;
        this.highlightConnectors.forEach(element => this.setConnectorWidth(element, containerWidth));
    }

    private setConnectorWidth(element: ElementRef, containerWidth: number) {
        this.renderer.setStyle(element.nativeElement, 'width', `${this.centerpointRelativeDistance * containerWidth}px`);
    }
}

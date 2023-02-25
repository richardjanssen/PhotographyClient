import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { HightlightService } from 'src/app/core/services/highlight.service';
import { AlignmentType, Highlight, HighlightType } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'app-highlights-chain',
    templateUrl: './highlights-chain.component.html',
    styleUrls: ['./highlights-chain.component.scss']
})
export class HighlightsChainComponent implements AfterViewInit, OnInit {
    @ViewChild('highlightsChain') highlightsChain: ElementRef;

    highlights: Highlight[];
    highlightAlignments: AlignmentType[];
    highlightType: typeof HighlightType = HighlightType;
    alignmentType: typeof AlignmentType = AlignmentType;

    constructor(
        readonly highlightService: HightlightService,
        private readonly renderer: Renderer2,
        private readonly viewportScroller: ViewportScroller
    ) {
        highlightService.getHighlights().subscribe(result => {
            this.highlightAlignments = this.getHighlightAlignments(result);
            this.highlights = result;
        });
    }

    ngOnInit(): void {
        this.viewportScroller.setOffset([0, 100]);
        fromEvent(window, 'resize').subscribe(() => {
            this.setHighlightsWidth();
        });
    }

    ngAfterViewInit(): void {
        this.setHighlightsWidth();

        setTimeout(() => {
            this.scrollToActiveHighlight();
        }, 1000);
    }

    private setHighlightsWidth(): void {
        const containerWidth = this.highlightsChain.nativeElement.offsetWidth;
        this.renderer.setProperty(document.documentElement, 'style', `--highlights-width: ${containerWidth}px`);
    }

    private scrollToActiveHighlight(): void {
        const activeHighlight = this.highlights.find(highlight => highlight.currentLocation);

        if (activeHighlight) {
            this.viewportScroller.scrollToAnchor(activeHighlight.id.toString());
        }
    }

    private getHighlightAlignments(highlights: Highlight[]): AlignmentType[] {
        let previousAlignmentType = AlignmentType.right;

        return highlights.map((highlight, index) => {
            if (highlight.type === this.highlightType.section) {
                return previousAlignmentType === AlignmentType.right ? AlignmentType.leftIncoming : AlignmentType.rightIncoming;
            }
            if (index === 0 && highlight.type === this.highlightType.place) {
                previousAlignmentType = AlignmentType.left;
                return AlignmentType.left;
            } else {
                const alignmentType = previousAlignmentType === AlignmentType.right ? AlignmentType.left : AlignmentType.right;
                previousAlignmentType = alignmentType;
                return alignmentType;
            }
        });
    }
}

import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { HightlightService } from 'src/app/core/services/highlight.service';
import { StyleService } from 'src/app/core/services/style.service';
import { AlignmentType, HighlightExpansion, Highlight, HighlightType } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'app-highlights-chain',
    templateUrl: './highlights-chain.component.html',
    styleUrls: ['./highlights-chain.component.scss']
})
export class HighlightsChainComponent implements AfterViewInit, OnInit {
    @ViewChild('highlightsChain') highlightsChain: ElementRef;

    highlights: Highlight[];
    highlightAlignments: AlignmentType[];
    private expandedPointHighlights: { sectionIndex: number; pointIndex: number }[] = [];
    expandedSectionHighlightIds: number[] = [];
    resizingSectionHighlightIds: number[] = [];
    highlightType: typeof HighlightType = HighlightType;
    alignmentType: typeof AlignmentType = AlignmentType;

    constructor(
        readonly highlightService: HightlightService,
        private readonly renderer: Renderer2,
        private readonly viewportScroller: ViewportScroller,
        private readonly _styleService: StyleService
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
    }

    trackHighlightExpansion(expansion: HighlightExpansion): void {
        if (expansion.isExpanded) {
            this.expandedPointHighlights.push({ sectionIndex: expansion.sectionIndex, pointIndex: expansion.pointIndex });
        } else {
            this.expandedPointHighlights = this.expandedPointHighlights.filter(
                highlight => highlight.sectionIndex !== expansion.sectionIndex || highlight.pointIndex !== expansion.pointIndex
            );
        }
        this.updateSectionHighlightExpansions(expansion);
    }

    scrollToCurrentLocation(): void {
        this.viewportScroller.scrollToAnchor('currentLocation');
    }

    private updateSectionHighlightExpansions(expansion: HighlightExpansion): void {
        // Get section highlight that contains toggled expansion
        const sectionHighlight = this.highlights.find(highlight => highlight.sectionHighlight?.highlightIndex === expansion.sectionIndex);
        const sectionHighlightIndex = sectionHighlight!.sectionHighlight!.highlightIndex;

        // If at least one section child is expanded and section is not already been added,
        // then add section highlight to expanded section highlights
        if (this.expandedPointHighlights.some(highlight => highlight.sectionIndex === sectionHighlightIndex)) {
            if (!this.expandedSectionHighlightIds.some(id => id === sectionHighlightIndex)) {
                this.resizingSectionHighlightIds.push(sectionHighlightIndex);
                this.expandedSectionHighlightIds.push(sectionHighlightIndex);
                setTimeout(() => {
                    this.resizingSectionHighlightIds = this.expandedSectionHighlightIds.filter(id => id !== sectionHighlightIndex);
                }, this._styleService.transitionTimeMs);
            }
            // Remove section highlight from expanded sections highlights if no childs are expanded
        } else {
            this.resizingSectionHighlightIds.push(sectionHighlightIndex);
            this.expandedSectionHighlightIds = this.expandedSectionHighlightIds.filter(id => id !== sectionHighlightIndex);
            setTimeout(() => {
                this.resizingSectionHighlightIds = this.expandedSectionHighlightIds.filter(id => id !== sectionHighlightIndex);
            }, this._styleService.transitionTimeMs);
        }
    }

    private setHighlightsWidth(): void {
        const containerWidth = this.highlightsChain.nativeElement.offsetWidth;
        this.renderer.setProperty(document.documentElement, 'style', `--highlights-width: ${containerWidth}px`);
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

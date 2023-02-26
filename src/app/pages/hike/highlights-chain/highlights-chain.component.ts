import { ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { HightlightService } from 'src/app/core/services/highlight.service';
import { AlignmentType, Highlight, HighlightExpansion, HighlightType } from 'src/app/core/types/highlight.type';

@Component({
    selector: 'app-highlights-chain',
    templateUrl: './highlights-chain.component.html',
    styleUrls: ['./highlights-chain.component.scss']
})
export class HighlightsChainComponent implements AfterViewInit, OnInit {
    @ViewChild('highlightsChain') highlightsChain: ElementRef;

    highlights: Highlight[];
    highlightAlignments: AlignmentType[];
    expandedHighlightIds: number[] = [];
    expandedSectionHighlightIds: number[] = [];
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

    trackHighlightExpansion(expansion: HighlightExpansion): void {
        if (expansion.isExpanded) {
            this.expandedHighlightIds.push(expansion.id);
        } else {
            this.expandedHighlightIds = this.expandedHighlightIds.filter(id => id !== expansion.id);
        }
        this.updateSectionHighlightExpansions(expansion);
    }

    private updateSectionHighlightExpansions(expansion: HighlightExpansion): void {
        // Get section highlight for that contains toggled expansion
        const sectionHighlight = this.highlights.find(highlight => {
            if (highlight.type === this.highlightType.place) {
                return false;
            }
            return highlight.children.map(child => child.id).includes(expansion.id);
        });

        // Get child highlights belonging to section highlight
        const childrenIds = sectionHighlight ? sectionHighlight.children.map(child => child.id) : [];

        // Add section highlight to expanded section highlights if at least one child is expanded and has not already been added
        if (childrenIds.some(id => this.expandedHighlightIds.includes(id))) {
            if (!this.expandedSectionHighlightIds.some(id => id === sectionHighlight!.id)) {
                this.expandedSectionHighlightIds.push(sectionHighlight!.id);
            }
            // Remove section highlight from expanded sections highlights if no childs are expanded
        } else {
            this.expandedSectionHighlightIds = this.expandedSectionHighlightIds.filter(id => id !== sectionHighlight!.id);
        }
    }

    private setHighlightsWidth(): void {
        const containerWidth = this.highlightsChain.nativeElement.offsetWidth;
        this.renderer.setProperty(document.documentElement, 'style', `--highlights-width: ${containerWidth}px`);
    }

    private scrollToActiveHighlight(): void {
        const flatHighlights = this.highlights.flatMap(highlight => {
            if (highlight.type === HighlightType.place) {
                return highlight;
            }
            if (highlight.type === HighlightType.section) {
                return highlight.children;
            }
            return [];
        });

        const activeHighlight = flatHighlights.find(highlight => highlight.currentLocation);

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

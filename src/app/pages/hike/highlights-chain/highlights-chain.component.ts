import { ViewportScroller, NgIf, NgFor, NgSwitch, NgSwitchCase, NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { AlignmentType, Highlight, HighlightType } from 'src/app/core/types/highlight.type';
import { SectionHighlightComponent } from './section-highlight/section-highlight.component';
import { PointHighlightComponent } from './point-highlight/point-highlight.component';
import { IconComponent } from '../../../core/components/icon/icon.component';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';

@Component({
    selector: 'highlights-chain',
    templateUrl: './highlights-chain.component.html',
    styleUrls: ['./highlights-chain.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        IconComponent,
        NgFor,
        NgSwitch,
        NgSwitchCase,
        PointHighlightComponent,
        NgClass,
        SectionHighlightComponent,
        BootstrapIconComponent
    ]
})
export class HighlightsChainComponent implements AfterViewInit, OnInit {
    @ViewChild('highlightsChain') highlightsChain: ElementRef;

    @Input() highlights: Highlight[];
    highlightAlignments: AlignmentType[];
    highlightType: typeof HighlightType = HighlightType;
    alignmentType: typeof AlignmentType = AlignmentType;

    constructor(private readonly renderer: Renderer2, private readonly viewportScroller: ViewportScroller) {}

    ngOnInit(): void {
        this.highlightAlignments = this.getHighlightAlignments(this.highlights);
        this.viewportScroller.setOffset([0, 100]);
        fromEvent(window, 'resize').subscribe(() => {
            this.setHighlightsWidth();
        });
    }

    ngAfterViewInit(): void {
        this.setHighlightsWidth();
    }

    scrollToCurrentLocation(): void {
        this.viewportScroller.scrollToAnchor('currentLocation');
    }

    private setHighlightsWidth(): void {
        if (this.highlights) {
            const containerWidth = this.highlightsChain.nativeElement.offsetWidth;
            this.renderer.setProperty(document.documentElement, 'style', `--highlights-width: ${containerWidth}px`);
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

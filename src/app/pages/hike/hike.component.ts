import { Component } from '@angular/core';
import { HightlightService } from 'src/app/core/services/highlight.service';
import { Highlight } from 'src/app/core/types/highlight.type';
import { FooterComponent } from '../home/footer/footer.component';
import { HighlightsChainComponent } from './highlights-chain/highlights-chain.component';
import { NgIf } from '@angular/common';
import { BannerComponent } from './banner/banner.component';
import { HeaderComponent } from '../home/header/header.component';

@Component({
    templateUrl: './hike.component.html',
    styleUrls: ['./hike.component.scss'],
    standalone: true,
    imports: [HeaderComponent, BannerComponent, NgIf, HighlightsChainComponent, FooterComponent]
})
export class HikeComponent {
    highlights: Highlight[];

    constructor(readonly highlightService: HightlightService) {
        highlightService.getHighlights().subscribe(result => {
            this.highlights = result;
        });
    }
}

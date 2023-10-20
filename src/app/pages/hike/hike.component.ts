import { Component } from '@angular/core';
import { HightlightService } from 'src/app/core/services/highlight.service';
import { Highlight } from 'src/app/core/types/highlight.type';
import { FooterComponent } from '../home/footer/footer.component';
import { HighlightsChainComponent } from './highlights-chain/highlights-chain.component';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { HikeBannerComponent } from './banner/hike-banner.component';
import { HeaderComponent } from '../home/header/header.component';
import { LoadingAnimationComponent } from '../../core/components/loading-animation/loading-animation.component';
import { DataStatus } from 'src/app/core/types/data-status.types';
import { inspectStatus } from 'src/app/core/helpers/rxjs-operators';
import { Observable } from 'rxjs';
import { ValidPipe } from '../../core/pipes/status/valid.pipe';
import { DataPipe } from '../../core/pipes/status/data.pipe';
import { LoadingPipe } from '../../core/pipes/status/loading.pipe';
import { ErrorPipe } from '../../core/pipes/status/error.pipe';

@Component({
    templateUrl: './hike.component.html',
    styleUrls: ['./hike.component.scss'],
    standalone: true,
    imports: [
        AsyncPipe,
        HeaderComponent,
        HikeBannerComponent,
        NgIf,
        NgClass,
        HighlightsChainComponent,
        FooterComponent,
        LoadingAnimationComponent,
        ValidPipe,
        DataPipe,
        LoadingPipe,
        ErrorPipe
    ]
})
export class HikeComponent {
    highlights$: Observable<DataStatus<Highlight[]>>;

    constructor(readonly highlightService: HightlightService) {
        this.highlights$ = highlightService.getHighlights().pipe(inspectStatus());
    }
}

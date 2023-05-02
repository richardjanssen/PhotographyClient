import { Component, Input, OnInit } from '@angular/core';
import { HikerUpdateService } from 'src/app/core/services/hiker-update.service';
import { HighlightContentType } from 'src/app/core/types/highlight.type';
import { HikerUpdateDetails } from 'src/app/core/types/hiker-update.type';

@Component({
    selector: 'photos-highlight',
    templateUrl: './photos-highlight.component.html'
})
export class PhotosHighlightComponent implements OnInit {
    @Input() hikerUpdateId: number | null;
    @Input() type: HighlightContentType.blog | HighlightContentType.photo;
    update: HikerUpdateDetails;
    highlightContentType = HighlightContentType;

    constructor(private readonly _hikerUpdateService: HikerUpdateService) {}

    ngOnInit(): void {
        if (this.hikerUpdateId !== null) {
            this._hikerUpdateService.getUpdate(this.hikerUpdateId).subscribe(update => (this.update = update));
        }
    }
}

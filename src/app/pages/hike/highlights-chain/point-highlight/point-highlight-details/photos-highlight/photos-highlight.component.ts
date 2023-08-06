import { Component, Input, OnInit } from '@angular/core';
import { marked } from 'marked';
import { HikerUpdateService } from 'src/app/core/services/hiker-update.service';
import { AlbumDetails } from 'src/app/core/types/album.type';
import { HighlightContentType } from 'src/app/core/types/highlight.type';
import { PhotoGridComponent } from '../../../../../home/photo-grid/photo-grid.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'photos-highlight',
    templateUrl: './photos-highlight.component.html',
    styleUrls: ['./photos-highlight.component.scss'],
    standalone: true,
    imports: [NgIf, PhotoGridComponent]
})
export class PhotosHighlightComponent implements OnInit {
    @Input() hikerUpdateId: number | null;
    @Input() type: HighlightContentType.blog | HighlightContentType.photo;
    hasLoaded: boolean;
    album: AlbumDetails | null;
    parsedText: string | null;
    highlightContentType = HighlightContentType;

    constructor(private readonly _hikerUpdateService: HikerUpdateService) {}

    ngOnInit(): void {
        if (this.hikerUpdateId !== null) {
            this._hikerUpdateService.getUpdate(this.hikerUpdateId).subscribe(update => {
                this.album = update.album;
                this.parsedText = update.text ? marked.parse(update.text) : null;
                this.hasLoaded = true;
            });
        }
    }
}

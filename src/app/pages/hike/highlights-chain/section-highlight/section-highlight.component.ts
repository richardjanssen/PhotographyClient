import { Component, Input, OnInit } from '@angular/core';
import { SectionHighlight, SectionHighlightType } from 'src/app/core/types/highlight.type';
import { PointHighlightComponent } from '../point-highlight/point-highlight.component';
import { IconComponent } from '../../../../core/components/icon/icon.component';
import { DatePipe, NgFor, NgIf, NgSwitch, NgSwitchDefault } from '@angular/common';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { DistancePipe } from 'src/app/core/pipes/distance.pipe';

@Component({
    selector: 'section-highlight',
    templateUrl: './section-highlight.component.html',
    styleUrls: ['./section-highlight.component.scss'],
    standalone: true,
    imports: [
        IconComponent,
        BootstrapIconComponent,
        DistancePipe,
        DatePipe,
        NgIf,
        NgFor,
        NgSwitch,
        NgSwitchDefault,
        NgSwitchDefault,
        PointHighlightComponent
    ]
})
export class SectionHighlightComponent implements OnInit {
    @Input() highlight: SectionHighlight;
    iconName: string;

    ngOnInit(): void {
        this.iconName = this._getIconName(this.highlight.type);
    }

    private _getIconName(type: SectionHighlightType): string {
        switch (type) {
            case SectionHighlightType.desert:
                return 'icon-dots';
            case SectionHighlightType.sparseForest:
                return 'wilderness-wide';
            case SectionHighlightType.denseForest:
                return 'wilderness-trees';
            default:
                return 'icon-dots';
        }
    }
}

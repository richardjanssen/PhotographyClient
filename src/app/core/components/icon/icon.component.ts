import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
    @Input() name: string;
    @Input() light: boolean;
    path: string;

    ngOnInit(): void {
        this.path = `../../../../assets/icons/${this.name}.svg#${this.name}`;
    }
}

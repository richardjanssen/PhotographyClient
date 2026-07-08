import { Component, Input, OnInit } from '@angular/core';


@Component({
    selector: 'icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
    imports: []
})
export class IconComponent implements OnInit {
    @Input() name: string;
    @Input() iconColor: string;
    path: string;

    ngOnInit(): void {
        this.path = `../../../../assets/icons/${this.name}.svg#${this.name}`;
    }
}

import { Component, Input, OnInit } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'bs-icon',
    templateUrl: './bootstrap-icon.component.html',
    styleUrls: ['./bootstrap-icon.component.scss'],
    standalone: true,
    imports: [NgIf, NgClass]
})
export class BootstrapIconComponent implements OnInit {
    @Input() name: string;
    @Input() iconColor: string;
    path: string;

    ngOnInit(): void {
        this.path = `../../../../assets/icons/bootstrap/${this.name}.svg#${this.name}`;
    }
}

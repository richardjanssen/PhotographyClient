import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'error-message',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './error-message.component.html'
})
export class ErrorMessageComponent {}

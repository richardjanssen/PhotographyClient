import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    readonly window: Window = window;

    reload(): void {
        this.window.location.reload();
    }
}

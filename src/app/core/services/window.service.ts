import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WindowService {
    readonly window: Window = window;
}

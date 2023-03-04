import { Component, OnDestroy, Renderer2 } from '@angular/core';

@Component({
    templateUrl: './hike.component.html'
})
export class HikeComponent implements OnDestroy {
    backgroundClass = 'primary-background-color';

    constructor(private readonly renderer: Renderer2) {
        this.renderer.addClass(document.body, this.backgroundClass);
    }

    ngOnDestroy(): void {
        this.renderer.removeClass(document.body, this.backgroundClass);
    }
}

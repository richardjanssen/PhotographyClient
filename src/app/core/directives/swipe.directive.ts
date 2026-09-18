import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import Hammer from 'hammerjs';

@Directive({
  selector: '[appSwipe]',
})
export class SwipeDirective implements OnInit {
  @Output() swipeRight = new EventEmitter<void>();
  @Output() swipeLeft = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const hammer = new Hammer(this.el.nativeElement);
    
    hammer.on('swiperight', () => {
      this.swipeRight.emit();
    });
    
    hammer.on('swipeleft', () => {
      this.swipeLeft.emit();
    });
  }
}
import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, effect, ElementRef, inject, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, EMPTY, interval, Observable, retry, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { WeekmenuService } from 'src/app/core/services/weekmenu.service';
import { Weekday, WeekmenuDay } from 'src/app/core/types/weekmenu/weekmenu.type';
import { BaseLayoutComponent } from 'src/app/core/components/base-layout/base-layout.component';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { CdkDrag, CdkDropList, CdkDragHandle, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { WeekdayPipe } from '../../../core/pipes/weekday.pipe';
import { ToasterService } from 'src/app/core/services/toaster.service';
import { SwipeDirective } from 'src/app/core/directives/swipe.directive';

@Component({
    selector: 'weekmenu',
    imports: [JsonPipe, BaseLayoutComponent, BootstrapIconComponent, CdkDrag, CdkDropList, CdkDragHandle, WeekdayPipe, SwipeDirective],
    templateUrl: './weekmenu.component.html',
    styleUrl: './weekmenu.component.scss'
})
export class WeekmenuComponent {
    private readonly weekmenuService = inject(WeekmenuService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly toasterService = inject(ToasterService);

    private readonly subscriptions: Subscription = new Subscription();
    private readonly saveSubject = new Subject<void>();

    private savePending: boolean = false;
    private enterPressed: boolean = false;
    private isMovingWeekmenuDay: boolean = false;

    weekmenuDayEditingIndex: WritableSignal<number | null> = signal<number | null>(null);
    weekmenuDayEditingValue: WritableSignal<string> = signal<string>('');

    weekmenu: Signal<WeekmenuDay[]> = toSignal(
        interval(7500).pipe(
            startWith(0),
            switchMap(() => {
                if (this.weekmenuDayEditingIndex() !== null || this.isMovingWeekmenuDay || this.savePending) {
                    return EMPTY;
                }
                return this.weekmenuService.get().pipe(catchError(() => EMPTY));
            })
        ),
        { initialValue: [] }
    );

    @ViewChild('weekmenuDayEditInput') weekmenuDayEditInput!: ElementRef<HTMLInputElement>;

    constructor() {
        this.subscriptions.add(
            this.saveSubject
                .pipe(
                    debounceTime(1500),
                    switchMap(() => this.performSave$())
                )
                .subscribe(() => {
                    return (this.savePending = false);
                })
        );

        // Focus on input field when starting weekmenuDay edit
        effect(() => {
            this.enterPressed = false;
            if (this.weekmenuDayEditingIndex() !== null) {
                setTimeout(() => {
                    return this.weekmenuDayEditInput?.nativeElement.focus();
                });
            }
        });
    }

    startEditingWeekmenuDay(index: number): void {
        const weekday = this.weekmenu().at(index)!;
        this.weekmenuDayEditingValue.set(weekday.name);
        this.weekmenuDayEditingIndex.set(index);
        this.changeDetectorRef.detectChanges();
    }

    dropWeekmenuDay(event: CdkDragDrop<string[]>): void {
        this.isMovingWeekmenuDay = false;

        if (event.previousIndex === event.currentIndex) {
            return;
        }

        const movedWeekmenuDay = this.weekmenu().at(event.previousIndex)!;
        const movedToWeekmenuDay = this.weekmenu().at(event.currentIndex)!;
        const newWeekdayForMovedProduct = movedToWeekmenuDay.weekday;

        const movedDown = event.currentIndex - event.previousIndex > 0;

        // Verplaats tussenliggende dagen omhoog of omlaag
        this.weekmenu().forEach((wd, index) => {
            if (index !== event.previousIndex && this.mustChangeWeekday(event.previousIndex, event.currentIndex, index)) {
                wd.weekday = movedDown ? this.getWeekdayBeforeWeekday(wd.weekday) : this.getWeekdayAfterWeekday(wd.weekday);
            }
        });

        // Verander de weekday van de verschoven dag
        movedWeekmenuDay.weekday = newWeekdayForMovedProduct;

        moveItemInArray(this.weekmenu(), event.previousIndex, event.currentIndex);
        this.saveWeekmenuToDb();
    }

    moveWeekmenuDay(): void {
        this.isMovingWeekmenuDay = true;
    }

    addNewWeekmenuDayAndStartEditing(): void {
        const newWeekmenuDayIndex = this.weekmenu().length;
        const newWeekmenuDayWeekday =
            newWeekmenuDayIndex === 0
                ? this.getWeekdayOfDayNumber(new Date().getDay())
                : this.getWeekdayAfterWeekday(this.weekmenu().at(newWeekmenuDayIndex - 1)!.weekday);

        this.addNewWeekmenuDay(newWeekmenuDayIndex, newWeekmenuDayWeekday);
        this.startEditingWeekmenuDay(newWeekmenuDayIndex);
    }

    cancelEditingWeekmenuDay(): void {
        this.weekmenuDayEditingIndex.set(null);
        this.weekmenuDayEditingValue.set('');
        this.enterPressed = false;
    }

    saveWeekmenuDayAndAddNewDay(index: number): void {
        this.enterPressed = true;

        this.saveWeekmenuDay(index);
        this.saveWeekmenuToDb();

        const currentWeekmenuDayWeekday = this.weekmenu().at(index)!.weekday;

        // Edit weekday of later weekmenu days
        this.weekmenu().forEach((wd, wdIndex) => {
            if (wdIndex > index) {
                wd.weekday = this.getWeekdayAfterWeekday(wd.weekday);
            }
        });

        const newWeekmenuDayIndex = index + 1;
        this.addNewWeekmenuDay(newWeekmenuDayIndex, this.getWeekdayAfterWeekday(currentWeekmenuDayWeekday));
        this.startEditingWeekmenuDay(newWeekmenuDayIndex);
    }

    saveWeekmenuDayAndCancelEditing(index: number): void {
        // Leaving the field through an enter press fires also the blur event. Prevent this logic from executing.
        if (this.enterPressed) {
            return;
        }

        this.saveWeekmenuDay(index);
        this.saveWeekmenuToDb();
        this.cancelEditingWeekmenuDay();
    }

    onSwipeWeekmenuDayRight(index: number): void {
        // Only allow deleting first row
        if(index !== 0) {
            return;
        }

        // Delete first row
        this.weekmenu().splice(0, 1);
        this.saveWeekmenuToDb();
    }
    private mustChangeWeekday(previousIndex: number, currentIndex: number, itemIndex: number): boolean {
        const movedDown = currentIndex - previousIndex > 0;
        const movedUp = !movedDown;
        const minIndex = Math.min(previousIndex, currentIndex);
        const maxIndex = Math.max(previousIndex, currentIndex);

        if ((movedDown && itemIndex > minIndex && itemIndex <= maxIndex) || (movedUp && itemIndex >= minIndex && itemIndex < maxIndex)) {
            return true;
        }

        return false;
    }

    private addNewWeekmenuDay(index: number, weekday: Weekday): void {
        const newWeekmenuDay = { id: null, rowVersion: null, weekday, name: '' };
        this.weekmenu().splice(index, 0, newWeekmenuDay);
    }

    private saveWeekmenuDay(index: number): void {
        const weekmenuDay = this.weekmenu().at(index)!;
        const newName = this.weekmenuDayEditInput.nativeElement.value.trim();
        if (newName !== weekmenuDay.name) {
            weekmenuDay.name = newName;
        }
    }

    private performSave$(): Observable<void> {
        return this.weekmenuService.save(this.weekmenu()).pipe(
            retry({ count: 2, delay: 1000 }),
            catchError(() => {
                this.toasterService.addAlert({ type: 'danger', msg: 'Opslaan mislukt', timeout: 3000 });

                return EMPTY;
            })
        );
    }
    private saveWeekmenuToDb(): void {
        this.savePending = true;
        this.saveSubject.next();
    }

    private getWeekdayAfterWeekday(weekday: Weekday): Weekday {
        switch (weekday) {
            case Weekday.monday:
                return Weekday.tuesday;
            case Weekday.tuesday:
                return Weekday.wednesday;
            case Weekday.wednesday:
                return Weekday.thursday;
            case Weekday.thursday:
                return Weekday.friday;
            case Weekday.friday:
                return Weekday.saturday;
            case Weekday.saturday:
                return Weekday.sunday;
            case Weekday.sunday:
                return Weekday.monday;
            default:
                return Weekday.monday;
        }
    }

    private getWeekdayBeforeWeekday(weekday: Weekday): Weekday {
        switch (weekday) {
            case Weekday.monday:
                return Weekday.sunday;
            case Weekday.tuesday:
                return Weekday.monday;
            case Weekday.wednesday:
                return Weekday.tuesday;
            case Weekday.thursday:
                return Weekday.wednesday;
            case Weekday.friday:
                return Weekday.thursday;
            case Weekday.saturday:
                return Weekday.friday;
            case Weekday.sunday:
                return Weekday.saturday;
            default:
                return Weekday.monday;
        }
    }

    private getWeekdayOfDayNumber(day: number): Weekday {
        switch (day) {
            case 1:
                return Weekday.monday;
            case 2:
                return Weekday.tuesday;
            case 3:
                return Weekday.wednesday;
            case 4:
                return Weekday.thursday;
            case 5:
                return Weekday.friday;
            case 6:
                return Weekday.saturday;
            case 7:
                return Weekday.sunday;
            default:
                return Weekday.monday;
        }
    }
}

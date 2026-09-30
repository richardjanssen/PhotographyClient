import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, effect, ElementRef, inject, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, interval, startWith, switchMap } from 'rxjs';
import { WeekmenuService } from 'src/app/core/services/weekmenu.service';
import { Weekday, WeekmenuDay } from 'src/app/core/types/weekmenu/weekmenu.type';
import { BaseLayoutComponent } from 'src/app/core/components/base-layout/base-layout.component';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { CdkDrag, CdkDropList, CdkDragHandle, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DistancePipe } from '../../../core/pipes/weekday.pipe';

@Component({
    selector: 'weekmenu',
    imports: [JsonPipe, BaseLayoutComponent, BootstrapIconComponent, CdkDrag, CdkDropList, CdkDragHandle, DistancePipe],
    templateUrl: './weekmenu.component.html',
    styleUrl: './weekmenu.component.scss'
})
export class WeekmenuComponent {
    private readonly weekmenuService = inject(WeekmenuService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    private enterPressed: boolean = false;
    private isMovingWeekmenuDay: boolean = false;

    weekmenuDayEditingIndex: WritableSignal<number | null> = signal<number | null>(null);
    weekmenuDayEditingValue: WritableSignal<string> = signal<string>('');

    weekmenu: Signal<WeekmenuDay[]> = toSignal(
        // TODO: 5000
        interval(500000).pipe(
            startWith(0),
            switchMap(() => {
                if (this.weekmenuDayEditingIndex() !== null || this.isMovingWeekmenuDay) {
                    return EMPTY;
                }
                return this.weekmenuService.get();
            })
        ),
        { initialValue: [] }
    );

    @ViewChild('weekmenuDayEditInput') weekmenuDayEditInput!: ElementRef<HTMLInputElement>;

    constructor() {
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

        moveItemInArray(this.weekmenu(), event.previousIndex, event.currentIndex);
        // TODO
        // this.saveGroceriesToDb();
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
        // TODO
        // this.saveGroceriesToDb();
        const currentWeekmenuDayWeekday = this.weekmenu().at(index)!.weekday;
        const newWeekmenuDayIndex = index + 1;
        this.addNewWeekmenuDay(newWeekmenuDayIndex, this.getWeekdayAfterWeekday(currentWeekmenuDayWeekday));
        // TODO: Van onderliggende dagen de weekday 1 opschuiven
        this.startEditingWeekmenuDay(newWeekmenuDayIndex);
    }

    saveWeekmenuDayAndCancelEditing(index: number): void {
        // Leaving the field through an enter press fires also the blur event. Prevent this logic from executing.
        if (this.enterPressed) {
            return;
        }

        this.saveWeekmenuDay(index);
        // TODO
        // this.saveGroceriesToDb();
        this.cancelEditingWeekmenuDay();
    }

    private addNewWeekmenuDay(index: number, weekday: Weekday): void {
        // TODO: geen friday standaard dag
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

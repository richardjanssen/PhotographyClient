import { Injectable, signal, WritableSignal } from '@angular/core';
import { Toaster } from '../types/alert.type';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {
    alerts: WritableSignal<Toaster[]> = signal([]);

    addAlert(toaster: Toaster): void {
        this.alerts().splice(this.alerts().length, 0, toaster);
    }

    removeToaster(toaster: Toaster): void {
        const index = this.alerts().indexOf(toaster);
        this.alerts().splice(index, 1);
    }

}


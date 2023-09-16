import { Component } from '@angular/core';
import { LocationService } from 'src/app/core/services/location.service';
import { PlaceService } from 'src/app/core/services/place.service';
import { WindowService } from 'src/app/core/services/window.service';
import { Place } from 'src/app/core/types/place.type';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, AsyncPipe, JsonPipe } from '@angular/common';
import { Observable, ReplaySubject, switchMap } from 'rxjs';
import { DataStatus } from 'src/app/core/types/data-status.types';
import { inspectStatus } from 'src/app/core/helpers/rxjs-operators';
import { DataStatusPipesModule } from 'src/app/core/pipes/status/data-status-pipes.module';
import { ErrorMessageComponent } from 'src/app/core/components/error-message/error-message.component';
import { LoadingMessageComponent } from 'src/app/core/components/loading-message/loading-message.component';
import { SuccessMessageComponent } from 'src/app/core/components/success-message/success-message.component';

@Component({
    selector: 'add-location',
    templateUrl: './add-location.component.html',
    styleUrls: ['./add-location.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        NgFor,
        AsyncPipe,
        DataStatusPipesModule,
        ErrorMessageComponent,
        LoadingMessageComponent,
        JsonPipe,
        SuccessMessageComponent
    ]
})
export class AddLocationComponent {
    placeId: number;

    submitted$: ReplaySubject<number> = new ReplaySubject<number>();
    places$: Observable<DataStatus<Place[]>>;
    submitResult$: Observable<DataStatus<null> | null> = new Observable<null>();

    constructor(locationService: LocationService, placeService: PlaceService, private readonly _windowService: WindowService) {
        this.places$ = placeService.getAll().pipe(inspectStatus());
        this.submitResult$ = this.submitted$.pipe(switchMap(placeId => locationService.addManual(placeId).pipe(inspectStatus())));
    }

    get formInvalid(): boolean {
        return !this.placeId;
    }

    onSubmit(): void {
        this.submitted$.next(this.placeId);
    }

    reloadComponent(): void {
        this._windowService.reload();
    }
}

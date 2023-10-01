import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Settings } from 'src/app/core/types/settings.types';
import { Observable, ReplaySubject, switchMap, tap } from 'rxjs';
import { DataStatus, StateStatus } from 'src/app/core/types/data-status.types';
import { SettingsService } from 'src/app/core/services/settings.service';
import { DataStatusPipesModule } from 'src/app/core/pipes/status/data-status-pipes.module';
import { LoadingMessageComponent } from '../../../../core/components/loading-message/loading-message.component';
import { ErrorMessageComponent } from '../../../../core/components/error-message/error-message.component';
import { inspectStatus } from 'src/app/core/helpers/rxjs-operators';
import { SuccessMessageComponent } from '../../../../core/components/success-message/success-message.component';

@Component({
    selector: 'update-settings',
    standalone: true,
    templateUrl: './update-settings.component.html',
    styleUrls: ['./update-settings.component.scss'],
    imports: [FormsModule, NgIf, AsyncPipe, DataStatusPipesModule, LoadingMessageComponent, ErrorMessageComponent, SuccessMessageComponent]
})
export class UpdateSettingsComponent {
    settings$: Observable<DataStatus<Settings>>;
    submitted$: ReplaySubject<null> = new ReplaySubject();
    submitResult$: Observable<DataStatus<null> | null> = new Observable<null>();

    trackingEnabled: boolean;
    mapboxEnabled: boolean;

    constructor(private readonly _settingsService: SettingsService) {
        this.settings$ = this._settingsService.get().pipe(
            inspectStatus(),
            tap(settings => {
                if (settings.status === StateStatus.valid) {
                    this.trackingEnabled = settings.value.trackingEnabled;
                    this.mapboxEnabled = settings.value.mapboxEnabled;
                }
            })
        );
        this.submitResult$ = this.submitted$.pipe(switchMap(() => this._settingsService.update(this._getSettings()).pipe(inspectStatus())));
    }

    onSubmit(): void {
        this.submitted$.next(null);
    }

    private _getSettings(): Settings {
        return {
            trackingEnabled: this.trackingEnabled,
            mapboxEnabled: this.mapboxEnabled
        };
    }
}

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { ToasterService } from './core/services/toaster.service';
import { Toaster } from './core/types/alert.type';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet, AlertComponent]
})
export class AppComponent {
    readonly toasterService = inject(ToasterService);

    onClosedAlert(dismissedToaster: Toaster): void {
        this.toasterService.removeToaster(dismissedToaster);
  }
}

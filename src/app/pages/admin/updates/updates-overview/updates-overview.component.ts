import { NgIf, NgFor, DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';
import { NullableDisplayPipe } from 'src/app/core/pipes/nullable-display.pipe';
import { HikerUpdateService } from 'src/app/core/services/hiker-update.service';
import { WindowService } from 'src/app/core/services/window.service';
import { HikerUpdateBasic } from 'src/app/core/types/hiker-update.type';

@Component({
    selector: 'updates-overview',
    templateUrl: './updates-overview.component.html',
    styleUrls: ['./updates-overview.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, DatePipe, NullableDisplayPipe, TitleCasePipe, BootstrapIconComponent]
})
export class UpdatesOverviewComponent {
    updates: HikerUpdateBasic[] = [];
    error: boolean = false;
    deleteError: boolean = false;

    updateToDelete: HikerUpdateBasic;
    showDeleteConfirmation: boolean;

    constructor(private readonly _hikerUpdateService: HikerUpdateService, private readonly _windowService: WindowService) {
        this._hikerUpdateService.getAll().subscribe({
            next: updates => (this.updates = updates),
            error: () => (this.error = true)
        });
    }

    onDelete(update: HikerUpdateBasic): void {
        this.updateToDelete = update;
        this.deleteError = false;
        this.showDeleteConfirmation = true;
    }

    confirmDelete(): void {
        this._hikerUpdateService.delete(this.updateToDelete.id).subscribe({
            next: () => this.reloadComponent(),
            error: () => (this.deleteError = true)
        });
    }

    cancelDelete(): void {
        this.showDeleteConfirmation = false;
    }

    reloadComponent(): void {
        this._windowService.reload();
    }
}

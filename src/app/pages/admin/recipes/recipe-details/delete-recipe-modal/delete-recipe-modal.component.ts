import { Component, EventEmitter, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BootstrapIconComponent } from 'src/app/core/components/bootstrap-icon/bootstrap-icon.component';

@Component({
    selector: 'delete-recipe-modal',
    imports: [BootstrapIconComponent],
    templateUrl: './delete-recipe-modal.component.html'
})
export class DeleteRecipeModalComponent {
    private readonly bsModalRef = inject(BsModalRef);
    
    public event: EventEmitter<string[]> = new EventEmitter();

    confirm(): void {
        this.event.emit();
        this.bsModalRef.hide();
    }

    close(): void {
        this.bsModalRef.hide();
    }
}

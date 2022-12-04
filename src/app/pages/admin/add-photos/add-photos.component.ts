import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { PhotosService } from 'src/app/core/services/photos.service';
import { Photo } from 'src/app/core/types/photo.type';

@Component({
    selector: 'app-add-photos',
    templateUrl: './add-photos.component.html',
    styleUrls: ['./add-photos.component.scss']
})
export class AddPhotosComponent {
    progress: number;
    message: string;
    fileSelected: boolean = false;
    submitted: boolean = false;
    uploadFinished: boolean = false;

    file: File;

    constructor(private readonly _photoService: PhotosService) {}

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.file = file;
            this.fileSelected = true;
        }
    }

    onSubmit(): void {
        if (this.file) {
            this.submitted = true;
            const formData = new FormData();
            formData.append('file', this.file, this.file.name);
            this._photoService.uploadPhoto(formData).subscribe((event: HttpEvent<Photo>) => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.progress = event.total ? event.loaded / event.total : 0;
                } else if (event.type === HttpEventType.Response) {
                    if (event.ok) {
                        this.message = 'Photo has been uploaded.';
                    }
                    this.uploadFinished = true;
                }
            });
        }
    }

    reloadComponent(): void {
        window.location.reload();
    }
}

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlbumService } from 'src/app/core/services/album.service';
import { PhotosService } from 'src/app/core/services/photos.service';
import { WindowService } from 'src/app/core/services/window.service';
import { Album } from 'src/app/core/types/album.type';
import { Photo } from 'src/app/core/types/photo.type';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, PercentPipe } from '@angular/common';

@Component({
    templateUrl: './add-photo.component.html',
    styleUrls: ['./add-photo.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, NgFor, PercentPipe]
})
export class AddPhotoComponent {
    progress: number;
    message: string;
    fileSelected: boolean = false;
    submitted: boolean = false;
    uploadFinished: boolean = false;
    uploadError: boolean = false;

    file: File;

    albums: Album[] = [];
    selectedAlbumId: number | null = null;

    constructor(
        private readonly _photoService: PhotosService,
        private readonly _windowService: WindowService,
        private readonly _albumService: AlbumService
    ) {
        this._albumService.getAlbums().subscribe(albums => (this.albums = albums));
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file: File | null = input.files ? input.files[0] : null;
        if (file) {
            this.file = file;
            this.fileSelected = true;
        }
    }

    onSubmit(): void {
        if (this.file) {
            this.submitted = true;
            const formData = new FormData();
            if (this.selectedAlbumId) {
                formData.append('albumId', this.selectedAlbumId.toString());
            }
            formData.append('file', this.file, this.file.name);
            this._photoService.uploadPhoto(formData).subscribe({
                next: (event: HttpEvent<Photo>) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = event.total ? event.loaded / event.total : 0;
                    } else if (event.type === HttpEventType.Response) {
                        if (event.ok) {
                            this.message = 'Photo has been uploaded.';
                        }
                        this.uploadFinished = true;
                    }
                },
                error: () => {
                    this.uploadError = true;
                    this.uploadFinished = true;
                }
            });
        }
    }

    reloadComponent(): void {
        this._windowService.reload();
    }
}

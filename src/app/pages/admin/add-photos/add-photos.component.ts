import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { PhotosService } from 'src/app/core/services/photos.service';

@Component({
  selector: 'app-add-photos',
  templateUrl: './add-photos.component.html',
  styleUrls: ['./add-photos.component.scss']
})
export class AddPhotosComponent {
  progress: number;
  message: string;
  fileUploaded: boolean = false;
  file: File;
  fileName = '';

  constructor(private http: HttpClient, private readonly _photoService: PhotosService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log(event);
    if (file) {
      this.file = file;  
      this.fileUploaded = true;
    }
  }

  onSubmit() {
      if (this.file) {
        const formData = new FormData();
        formData.append('file', this.file, this.file.name);
        this._photoService.uploadPhoto(formData).subscribe((event: any) => {
          if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
        }
        });
      }
  }

}

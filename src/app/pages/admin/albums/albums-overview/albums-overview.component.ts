import { Component } from '@angular/core';
import { AlbumService } from 'src/app/core/services/album.service';
import { Album, AlbumDetails } from 'src/app/core/types/album.type';
import { PhotoTableComponent } from '../../../../core/components/photo-table/photo-table.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, ReplaySubject, of, switchMap, tap } from 'rxjs';
import { DataStatus, StateStatus } from 'src/app/core/types/data-status.types';
import { DataStatusPipesModule } from 'src/app/core/pipes/status/data-status-pipes.module';
import { LoadingMessageComponent } from '../../../../core/components/loading-message/loading-message.component';
import { ErrorMessageComponent } from '../../../../core/components/error-message/error-message.component';
import { inspectStatus } from 'src/app/core/helpers/rxjs-operators';
import { WindowService } from 'src/app/core/services/window.service';
import { NullableDisplayPipe } from '../../../../core/pipes/nullable-display.pipe';

@Component({
    selector: 'albums-overview',
    templateUrl: './albums-overview.component.html',
    styleUrls: ['./albums-overview.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        NgFor,
        NgIf,
        PhotoTableComponent,
        AsyncPipe,
        DataStatusPipesModule,
        LoadingMessageComponent,
        ErrorMessageComponent,
        NullableDisplayPipe
    ]
})
export class AlbumsOverviewComponent {
    albums: Album[];
    selectedAlbumId: string;
    selectedAlbumId$: ReplaySubject<string> = new ReplaySubject();
    selectedAlbumDetails: AlbumDetails | null;

    deleted$: ReplaySubject<AlbumPhotoDelete | null> = new ReplaySubject<AlbumPhotoDelete | null>();
    deleteResult$: Observable<DataStatus<null> | null> = new Observable<null>();
    numberOfItems: number = 50;

    photoToDelete: AlbumPhotoDelete;
    showDeleteConfirmation: boolean;

    constructor(private readonly _albumService: AlbumService, windowService: WindowService) {
        this._albumService.getAlbums().subscribe(albums => (this.albums = albums));

        this.selectedAlbumId$
            .pipe(switchMap(albumId => this._albumService.getById(this.getAlbumId(albumId))))
            .subscribe(albumDetails => (this.selectedAlbumDetails = albumDetails));

        this.deleteResult$ = this.deleted$.pipe(
            switchMap(photoToDelete =>
                photoToDelete
                    ? this._albumService.deletePhoto(photoToDelete.albumId, photoToDelete.photoId).pipe(
                          inspectStatus(),
                          tap(dataStatus => {
                              if (dataStatus.status === StateStatus.valid) {
                                  windowService.reload();
                              }
                          })
                      )
                    : of(null)
            )
        );
    }

    onAlbumSelect(albumId: string): void {
        this.selectedAlbumDetails = null;
        this.cancelDelete();
        this.selectedAlbumId$.next(albumId);
    }

    onPendingDelete(photoId: number): void {
        const albumId = this.getAlbumId(this.selectedAlbumId);
        this.photoToDelete = {
            albumId: albumId,
            albumName: this.albums.find(album => album.id === albumId)?.title ?? null,
            photoId
        };
        this.showDeleteConfirmation = true;
    }

    confirmDelete(): void {
        this.deleted$.next(this.photoToDelete);
    }

    cancelDelete(): void {
        this.deleted$.next(null);
        this.showDeleteConfirmation = false;
    }

    private getAlbumId(albumId: string): number {
        return parseInt(albumId, 10);
    }
}

export interface AlbumPhotoDelete {
    albumId: number;
    albumName: string | null;
    photoId: number;
}

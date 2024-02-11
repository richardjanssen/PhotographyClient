import { Component } from '@angular/core';
import { AlbumService } from 'src/app/core/services/album.service';
import { Album, AlbumDetails } from 'src/app/core/types/album.type';
import { PhotoTableComponent } from '../../../../core/components/photo-table/photo-table.component';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, ReplaySubject, combineLatest, map, of, startWith, switchMap, tap } from 'rxjs';
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
        JsonPipe,
        DataStatusPipesModule,
        LoadingMessageComponent,
        ErrorMessageComponent,
        NullableDisplayPipe
    ]
})
export class AlbumsOverviewComponent {
    vm$: Observable<{
        albums: Album[];
        selectedAlbumId: number | null;
        selectedAlbumName: string | null;
        selectedAlbumDetails: AlbumDetails | null;
        deleteResult: DataStatus<null> | null;
    }>;

    selectedAlbumId: string;
    selectedAlbumId$: ReplaySubject<string> = new ReplaySubject();
    deleted$: ReplaySubject<AlbumPhotoDelete | null> = new ReplaySubject<AlbumPhotoDelete | null>();

    photoToDelete: AlbumPhotoDelete;
    showDeleteConfirmation: boolean;

    constructor(private readonly _albumService: AlbumService, windowService: WindowService) {
        const albums$ = this._albumService.getAlbums();
        const selectedAlbumDetails$ = this.selectedAlbumId$.pipe(
            map(albumId => this.getAlbumId(albumId)),
            switchMap(albumId =>
                this._albumService.getById(albumId).pipe(
                    map(albumDetails => {
                        return { albumDetails, albumId };
                    })
                )
            ),
            startWith(null)
        );
        const deleteResult$ = this.deleted$.pipe(
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
            ),
            startWith(null)
        );

        this.vm$ = combineLatest([albums$, selectedAlbumDetails$, deleteResult$]).pipe(
            map(([albums, selectedAlbumDetails, deleteResult]) => ({
                albums,
                selectedAlbumId: selectedAlbumDetails?.albumId ?? null,
                selectedAlbumDetails: selectedAlbumDetails?.albumDetails ?? null,
                selectedAlbumName: albums.find(album => album.id === selectedAlbumDetails?.albumId)?.title ?? null,
                deleteResult
            }))
        );
    }

    onAlbumSelect(albumId: string): void {
        this.cancelDelete();
        this.selectedAlbumId$.next(albumId);
    }

    onPendingDelete(photoId: number, albumId: number | null, albumName: string | null): void {
        if (albumId === null || albumName === null) {
            return;
        }

        this.photoToDelete = { albumId, albumName, photoId };
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

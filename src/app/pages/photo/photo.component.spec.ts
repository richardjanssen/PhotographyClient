import { Router } from '@angular/router';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { PhotoCacheService } from 'src/app/core/services/photo-cache.service';
import { Photo } from 'src/app/core/types/photo.type';
import { instance, mock } from 'ts-mockito';
import { PhotoComponent } from './photo.component';

describe('PhotoComponent', () => {
    let sut: PhotoComponent;
    const routerMock: Router = mock(Router);
    const photoCacheServiceMock: PhotoCacheService = mock(PhotoCacheService);
    const environmentServiceMock: EnvironmentService = mock(EnvironmentService);
    const photos: Photo[] = [
        { id: 0, date: new Date(), images: [] },
        { id: 1, date: new Date(), images: [] },
        { id: 2, date: new Date(), images: [] }
    ];

    beforeEach(() => {
        sut = new PhotoComponent(instance(routerMock), instance(environmentServiceMock), instance(photoCacheServiceMock));
    });

    [
        { initialActiveIndex: 0, expectedActiveIndex: 2 },
        { initialActiveIndex: 2, expectedActiveIndex: 1 }
    ].forEach(testCase => {
        it(`previousPhoto should modify activeIndex from ${testCase.initialActiveIndex} to ${testCase.expectedActiveIndex}`, () => {
            sut.photos = photos;
            sut.activeIndex = testCase.initialActiveIndex;

            sut.previousPhoto();
            expect(sut.activeIndex).toBe(testCase.expectedActiveIndex);
        });
    });

    [
        { initialActiveIndex: 0, expectedActiveIndex: 1 },
        { initialActiveIndex: 2, expectedActiveIndex: 0 }
    ].forEach(testCase => {
        it(`nextPhoto should modify activeIndex from ${testCase.initialActiveIndex} to ${testCase.expectedActiveIndex}`, () => {
            sut.photos = photos;
            sut.activeIndex = testCase.initialActiveIndex;

            sut.nextPhoto();
            expect(sut.activeIndex).toBe(testCase.expectedActiveIndex);
        });
    });
});

import { PhotoCarouselComponent } from './photo-carousel.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { instance, mock } from 'ts-mockito';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { Photo } from 'src/app/core/types/photo.type';

describe('PhotoCarouselComponent', () => {
    let sut: PhotoCarouselComponent;
    const environmentServiceMock: EnvironmentService = mock(EnvironmentService);
    const bsModalRefMock: BsModalRef = mock(BsModalRef);
    const photos: Photo[] = [
        { id: 0, date: new Date(), images: [] },
        { id: 1, date: new Date(), images: [] },
        { id: 2, date: new Date(), images: [] }
    ];

    beforeEach(() => {
        sut = new PhotoCarouselComponent(instance(bsModalRefMock), instance(environmentServiceMock));
    });

    [
        { initialActiveIndex: 0, expectedActiveIndex: 2 },
        { initialActiveIndex: 2, expectedActiveIndex: 1 }
    ].forEach(testCase => {
        it(`previousPhoto should modify activeIndex from ${testCase.initialActiveIndex} to ${testCase.expectedActiveIndex}`, () => {
            sut.photos = photos;
            sut.activePhotoIndex = testCase.initialActiveIndex;

            sut.previousPhoto();
            expect(sut.activePhotoIndex).toBe(testCase.expectedActiveIndex);
        });
    });

    [
        { initialActiveIndex: 0, expectedActiveIndex: 1 },
        { initialActiveIndex: 2, expectedActiveIndex: 0 }
    ].forEach(testCase => {
        it(`nextPhoto should modify activeIndex from ${testCase.initialActiveIndex} to ${testCase.expectedActiveIndex}`, () => {
            sut.photos = photos;
            sut.activePhotoIndex = testCase.initialActiveIndex;

            sut.nextPhoto();
            expect(sut.activePhotoIndex).toBe(testCase.expectedActiveIndex);
        });
    });
});

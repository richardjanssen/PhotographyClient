import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { GridImageInfo } from 'src/app/core/types/grid-image-info.type';
import { Grid } from 'src/app/core/types/grid.type';
import { GridItem } from 'src/app/core/types/grid-item.type';
import { Photo } from 'src/app/core/types/photo.type';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PhotoCarouselComponent } from './photo-carousel/photo-carousel.component';

@Component({
    selector: 'app-photo-grid',
    templateUrl: './photo-grid.component.html',
    styleUrls: ['./photo-grid.component.scss'],
    standalone: true,
    imports: [NgFor, RouterLink, ModalModule],
    providers: [BsModalService]
})
export class PhotoGridComponent implements AfterViewInit {
    @ViewChild('gridContainer') container: ElementRef;
    private imageInfo: GridImageInfo[];
    private readonly gutter: number = 5;
    private readonly minContainerWidth: number = 300; // Smaller containers always show one image per row
    private readonly maxRowHeight: number = 320;
    @Input() photos: Photo[];

    gridItems: GridItem[];
    gridHeight: number;

    constructor(private readonly _environmentService: EnvironmentService, private readonly _bsModalService: BsModalService) {}

    ngAfterViewInit(): void {
        this.imageInfo = this.photos.map(photo => this.mapPhotoToImageInfo(photo, this._environmentService.baseApiUrl));
        this.resizeImages();

        fromEvent(window, 'resize').subscribe(() => {
            this.resizeImages();
        });
    }

    onPhotoClick(photoId: number): void {
        this._bsModalService.show(PhotoCarouselComponent, {
            class: 'full-screen-modal',
            initialState: {
                photos: this.photos,
                activePhotoId: photoId
            }
        });
    }

    private resizeImages(): void {
        const grid = this.getGrid(this.imageInfo);
        this.gridItems = grid.gridItems;
        this.gridHeight = grid.totalGridHeight;
    }

    private mapPhotoToImageInfo(photo: Photo, baseApiUrl: string): GridImageInfo {
        const largestImage = photo.images.sort((a, b) => b.widthPx - a.widthPx)[0];
        return {
            id: photo.id,
            naturalWidth: largestImage.widthPx,
            naturalHeight: largestImage.heightPx,
            ratio: largestImage.widthPx / largestImage.heightPx,
            src: baseApiUrl + largestImage.path,
            srcset: photo.images.map(image => `${baseApiUrl}${image.path} ${image.widthPx}w`).join(',')
        };
    }

    private getGrid(array: GridImageInfo[]): Grid {
        /**
         * Slices images and checks if it the slice smaller than the min width (max. one image per row), or smaller than the max row height.
         * If the max row height is exceeded, the number of images in the slice is increased. This increases the total natural width of the
         * images and thus, for a fixed container width, decreases the corresponding height. Based on these conditions, grid item dimensions
         * and offsets are determined. Additionally, the total grid height is calculated.
         */
        let gridItems: GridItem[] = [];
        let currentOffsetTop = 0;
        const containerWidth: number = this.container.nativeElement.clientWidth;
        for (let i = 1; i <= array.length; i++) {
            let currentRowHeight = 0;
            const subArray = array.slice(0, i);

            if (containerWidth < this.minContainerWidth) {
                // Size image based on width
                if (subArray.length > 1) {
                    throw new Error('Exactly one image was expected in the array here');
                }
                gridItems = [...gridItems, this.mapGridItemByWidth(subArray[0], containerWidth, currentOffsetTop)];
                currentRowHeight = this.getHeightByWidth(subArray[0], containerWidth);
            } else if ((currentRowHeight = this.getImagesHeightForWidth(subArray, containerWidth)) < this.maxRowHeight) {
                // Size image(s) based on height
                gridItems = [...gridItems, ...this.getGridItemsForRowHeight(subArray, currentRowHeight, currentOffsetTop)];
            } else {
                continue;
            }

            currentOffsetTop += currentRowHeight + this.gutter;

            array = array.slice(i);
            i = 0;
        }

        // Any remaining images that do not fill the container width, get the maxRowHeight and are centered
        if (array.length > 0) {
            const finalRowGridItems = this.getGridItemsForRowHeight(array, this.maxRowHeight, currentOffsetTop);
            const finalGridItem = finalRowGridItems[finalRowGridItems.length - 1];
            const finalRowWidth = finalGridItem.offsetLeft + finalGridItem.width;
            const margin = containerWidth - finalRowWidth;
            finalRowGridItems.forEach(item => (item.offsetLeft += margin / 2));
            gridItems = [...gridItems, ...finalRowGridItems];
            currentOffsetTop += this.maxRowHeight + this.gutter;
        }

        return { gridItems, totalGridHeight: currentOffsetTop };
    }

    private getImagesHeightForWidth(images: GridImageInfo[], width: number): number {
        /**
         * Gets the resulting row height if all images in the array have to fit within the specified width.
         */
        const numberOfGutters = images.length - 1;
        const workWidth = width - numberOfGutters * this.gutter;
        let sumRatio = 0;

        for (const image of images) {
            sumRatio += image.ratio;
        }

        return sumRatio > 0 ? workWidth / sumRatio : 0;
    }

    private getGridItemsForRowHeight(images: GridImageInfo[], rowHeight: number, offsetTop: number): GridItem[] {
        /**
         * Map an array of grid image info to grid items, where the width is based on the row height and image aspect ratio.
         */
        let currentOffsetLeft = 0;

        const gridItems = images.map(image => {
            const gridItem = this.mapGridItemByHeight(image, rowHeight, offsetTop, currentOffsetLeft);
            currentOffsetLeft += gridItem.width + this.gutter;
            return gridItem;
        });

        return gridItems;
    }

    private mapGridItemByHeight(image: GridImageInfo, height: number, offsetTop: number, offsetLeft: number): GridItem {
        /**
         * Map single grid image info to a grid item, where the width is based on the height and image aspect ratio.
         */
        return {
            id: image.id,
            width: height * image.ratio,
            height,
            offsetTop,
            offsetLeft,
            srcset: image.srcset,
            src: image.src
        };
    }

    private mapGridItemByWidth(image: GridImageInfo, width: number, offsetTop: number): GridItem {
        /**
         * Map single grid image info to a grid item, where the height is based on the width and image aspect ratio.
         */
        return {
            id: image.id,
            width,
            height: this.getHeightByWidth(image, width),
            offsetTop,
            offsetLeft: 0,
            srcset: image.srcset,
            src: image.src
        };
    }

    private getHeightByWidth(image: GridImageInfo, width: number): number {
        return width / image.ratio;
    }
}

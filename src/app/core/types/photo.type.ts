import { Image } from './image.type';

export interface Photo {
    id: number;
    date: Date;
    images: Image[];
}

import { HighlightContentType } from './types/highlight.type';

export class Constants {
    public static readonly expandableHighlightTypes: HighlightContentType[] = [
        HighlightContentType.photo,
        HighlightContentType.blog,
        HighlightContentType.location
    ];
}

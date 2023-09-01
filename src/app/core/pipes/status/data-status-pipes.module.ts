import { NgModule } from '@angular/core';
import { DataPipe } from './data.pipe';
import { ValidPipe } from './valid.pipe';
import { ErrorPipe } from './error.pipe';
import { LoadingPipe } from './loading.pipe';

@NgModule({
    declarations: [],
    imports: [DataPipe, ValidPipe, ErrorPipe, LoadingPipe],
    exports: [DataPipe, ValidPipe, ErrorPipe, LoadingPipe]
})
export class DataStatusPipesModule {}

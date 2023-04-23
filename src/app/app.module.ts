import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PhotosOverviewComponent } from './pages/admin/photos-overview/photos-overview.component';
import { AddPhotosComponent } from './pages/admin/add-photos/add-photos.component';
import { HomeComponent } from './pages/home/home.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './pages/home/header/header.component';
import { PhotoGridComponent } from './pages/home/photo-grid/photo-grid.component';
import { HttpHeaderInterceptor } from './core/interceptors/http-header.interceptor';
import { PhotoComponent } from './pages/photo/photo.component';
import { FooterComponent } from './pages/home/footer/footer.component';
import { BaseLayoutComponent } from './core/components/base-layout/base-layout.component';
import { HikeComponent } from './pages/hike/hike.component';
import { HighlightsChainComponent } from './pages/hike/highlights-chain/highlights-chain.component';
import { PointHighlightComponent } from './pages/hike/highlights-chain/point-highlight/point-highlight.component';
import { PhotosHighlightComponent } from './pages/hike/highlights-chain/point-highlight/photos-highlight/photos-highlight.component';
import { SectionHighlightComponent } from './pages/hike/highlights-chain/section-highlight/section-highlight.component';
import { BannerComponent } from './pages/hike/banner/banner.component';
import { AlbumsComponent } from './pages/admin/albums/albums.component';
import { UpdatesComponent } from './pages/admin/updates/updates.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PointHighlightSummaryComponent } from './pages/hike/highlights-chain/point-highlight/point-highlight-summary/point-highlight-summary.component';
import { PointHighlightDetailsComponent } from './pages/hike/highlights-chain/point-highlight/point-highlight-details/point-highlight-details.component';
import { IconComponent } from './core/components/icon/icon.component';

@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        PhotosOverviewComponent,
        AddPhotosComponent,
        HomeComponent,
        UnauthorizedComponent,
        LoginComponent,
        HeaderComponent,
        PhotoGridComponent,
        PhotoComponent,
        FooterComponent,
        BaseLayoutComponent,
        HikeComponent,
        HighlightsChainComponent,
        PointHighlightComponent,
        PhotosHighlightComponent,
        SectionHighlightComponent,
        BannerComponent,
        AlbumsComponent,
        UpdatesComponent,
        PointHighlightSummaryComponent,
        PointHighlightDetailsComponent,
        IconComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: () => localStorage.getItem(environment.tokenName)
            }
        }),
        BrowserAnimationsModule,
        CarouselModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpHeaderInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}

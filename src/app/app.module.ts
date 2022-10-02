import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        PhotosOverviewComponent,
        AddPhotosComponent,
        HomeComponent,
        UnauthorizedComponent,
        LoginComponent
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
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app.routes';
import { AuthorizationGuard } from './app/core/guards/authorization.guard';
import { AuthenticationInterceptor } from './app/core/interceptors/http-header.interceptor';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection(),
        importProvidersFrom(
            BrowserModule,
            FormsModule,
            ReactiveFormsModule,
            CarouselModule
        ),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true
        },
        AuthorizationGuard,
        provideRouter(APP_ROUTES),
        provideHttpClient(withInterceptorsFromDi())
    ]
}).catch(err => console.error(err));

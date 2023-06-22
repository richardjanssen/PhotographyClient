import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { HttpHeaderInterceptor } from './app/core/interceptors/http-header.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app.routes';
import { AuthorizationGuard } from './app/core/guards/authorization.guard';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            FormsModule,
            ReactiveFormsModule,
            JwtModule.forRoot({
                config: {
                    tokenGetter: () => localStorage.getItem(environment.tokenName)
                }
            }),
            CarouselModule
        ),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpHeaderInterceptor,
            multi: true
        },
        AuthorizationGuard,
        provideRouter(APP_ROUTES),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
}).catch(err => console.error(err));

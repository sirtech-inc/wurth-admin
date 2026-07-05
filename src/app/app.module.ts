import {HttpClient, HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';

import {AccountState} from '@shared/state/account.state';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CoreModule} from '@core/core.module';
import {DashboardState} from '@shared/state/dashboard.state';
import {LoaderState} from '@shared/state/loader.state';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {MenuState} from '@shared/state/menu.state';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxsModule} from '@ngxs/store';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';
import {NotificationState} from '@shared/state/notification.state';
import {SharedModule} from '@shared/shared.module';
import {ToastrModule} from 'ngx-toastr';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppPrimeNgModule} from "@shared/app-prime-ng.module";
import { apiKeyInterceptor } from './interceptors/api-key.interceptor';

// Component


// State


// import { AttachmentState } from './shared/state/attachment.state';


// import { AttachmentState } from './shared/state/attachment.state';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        AppRoutingModule,
        NgxsModule.forRoot([
            LoaderState,
            MenuState,
            NotificationState,
            AccountState,
            DashboardState,
            // AttachmentState
        ]),
        NgxsStoragePluginModule.forRoot({
            key: [
                'auth',
                'dashboard',
                'notification',
                'account',
                'country',
                'state',
                'setting'
            ]
        }),
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            positionClass: 'toast-top-center',
            timeOut: 5000,
            extendedTimeOut: 5000,
        }),
        SharedModule,
        CoreModule,
        LoadingBarRouterModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        NgbModule,
        AppPrimeNgModule
    ],
    providers: [
        provideHttpClient(withInterceptors([apiKeyInterceptor]))
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

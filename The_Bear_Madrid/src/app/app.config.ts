import { ApplicationConfig, InjectionToken, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import IStorageSvc from './modelos/IStorageSvc';
import { StorageGlobalService } from './servicios/storage-global.service';
import { authInterceptor } from './interceptors/authe.interceptor';

export const HTTP_INJECTIONTOKEN_STORAGE_SVCS:InjectionToken<IStorageSvc>=new InjectionToken<IStorageSvc>('token asociado a servicios q implementan interface IStorageService');

export const appConfig: ApplicationConfig = {
  providers: [
              {provide: HTTP_INJECTIONTOKEN_STORAGE_SVCS, useClass:StorageGlobalService},
              provideZoneChangeDetection({ eventCoalescing: true }),
              provideRouter(routes),
              provideHttpClient( withInterceptors([authInterceptor]))
            ]
};

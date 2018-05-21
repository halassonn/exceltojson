import { XHRBackend } from '@angular/http';
import {ReduxRequestOptions} from './redux-request.options';
import {LoaderService} from './loader/loader.service';
import {HttpService} from './http.service';

function httpServiceFactory(backend: XHRBackend, options: ReduxRequestOptions, loaderService: LoaderService ) {
    return new HttpService(backend, options, loaderService);
  }
export { httpServiceFactory };

import { BaseRequestOptions } from '@angular/http';


export class ReduxRequestOptions extends BaseRequestOptions {
    public token: string;

  constructor (angularReduxOptions?: any) {

    super();

    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.token = user && user.token;
    this.headers.append('enctype', 'multipart/form-data');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('X-Requested-With', 'XMLHttpRequest');
    this.headers.append('Authorization', 'Bearer ' + this.token );

    if (angularReduxOptions != null) {

      // tslint:disable-next-line:forin
      for (const option in angularReduxOptions) {
        const optionValue = angularReduxOptions[option];
        this[option] = optionValue;
      }
    }
  }
}

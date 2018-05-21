import { Injectable } from '@angular/core';
import { HttpService } from '../core/_http/http.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';

@Injectable()
export class AuthService {
    token: any;

    constructor(
        private _http: HttpService, private router: Router
    ) { }

    on_login(username: string, password: string): Observable<any> {
        return this._http.post('api/auth', JSON.stringify({ username: username, password: password }
        )).map((response: Response) => {
            console.log(response);
            const token = response.json() && response.json().token;
            this.token = token;
            localStorage.setItem('currentUser', JSON.stringify({ username: username, token: this.token }));
            localStorage.setItem('isLoggin', 'true');
            localStorage.setItem('kodekantor', response.json().kodekantor);
        }).catch(this.handleError);
    }
    on_logout() {
            localStorage.removeItem('currentUser');
            localStorage.setItem('isLoggin', 'false');
            localStorage.setItem('kodekantor', 'null');
            this.router.navigateByUrl('');
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;

        if (error instanceof Response) {
            if (error.status !== 0) {
                const errbody = error.json() || '';
                errMsg = `${errbody.message}`;
            } else {
                errMsg = 'Connection Error';
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);

        return Observable.throw(errMsg);
    }

}

import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../core/_http/http.service';
import { ProfileModel } from '../model/profile.model';
import { FunctionUtils } from '../core/utils/function';

@Injectable()
export class ProfileService {
    @Output() loaderclass: EventEmitter<any> = new EventEmitter();
    constructor(private _http: HttpService, private functionmasakerja: FunctionUtils) {
    }

    getAllDataKaryawanBy(by: string, param: string): Observable<ProfileModel[]> {
        return this._http.get('api/data_karyawan/by-' + by + '/' + param)
            .map((response: Response) => response.json() as ProfileModel[])
            .catch(this.handleError);
    }

    getDataKaryawan(nik) {
        return this._http.get('api/data_karyawan/by_nik?nik=' + nik)
            .map((response: Response) => response.json().body)
            .catch(this.handleError);
    }


    getAllDataKaryawan(): Observable<ProfileModel[]> {
        return this._http.get('api/data_karyawans')
            .map((response: Response) => response.json().body as ProfileModel[])
            .catch(this.handleError);
    }

    /*getAllDataKantor(): Observable<DatakantorModel[]> {
      return this._http.get('datakantors')
        .map((response: Response) => response.json() as DatakantorModel[])
        .catch(this.handleError);
    }*/

    saveDatakaryawan(data: ProfileModel) {
        return this._http.post('api/data_karyawan', JSON.stringify(data));
        //  .catch(this.handleError);
    }
    updateDataKaryawan(data: ProfileModel) {
        return this._http.put('api/data_karyawan?id=' + data.id, JSON.stringify(data));
    }
    deleteDataKaryawan(id: string) {
        return this._http.delete('api/data_karyawan?id=' + id);
    }




    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }


    /*event emitter */
    public sideOpen(): any {
        return this.loaderclass.emit('page-container');
    }
    public sideclose(): any {
        return this.loaderclass.emit('page-container-full');
    }

    getEmittedValue() {
        return this.loaderclass;
    }

    updatemasakerja() {
        this.getAllDataKaryawan().subscribe(
            (datak) => {
                if (datak.length !== 0) {

                    for (let x of datak) {
                        let ms = this.functionmasakerja.getMasakerja(x.tglmasuk);
                        x.masakerja = ms.masakerjath + 'TH ' + ms.masakerjabl + 'BL';
                        this.saveDatakaryawan(x).subscribe(
                            (res) => {
                                const success = JSON.parse(res._body);
                                console.log(success.body);
                            }
                        )
                    }
                }
            }
        );
    }

}

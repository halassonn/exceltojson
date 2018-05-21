import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../core/_http/http.service';
import { KolomTunjangan } from '../model/kolomtunjangan.model';
import { ParameterBpjsModel } from '../model/parameterbpjs.model';


@Injectable()
export class SettingService {
    constructor(private _http: HttpService) { }

    // get parameter all jenis tunjangan karyawan
    public getAllParameterJenisTunjanganKaryawan(): any {
        return this._http.get('api/jenis_tunjangans')
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    // get parameter all kolom tunjangan
    public getAllParameterKolomTunjangan(): any {
        return this._http.get('api/parameter_kolom_tunjangans')
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }
    // get parameter all bpjs

    public getAllParameterBpjs() {
        return this._http.get('api/bpjs_all')
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }
    // get all parameter pph21
    public getAllParameterpph21() {
        return this._http.get('api/pph21_all')
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    // get all parameter jabatan
    public getAllParameterJabatan() {
        return this._http.get('api/jabatans')
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    // get all parameter agama

    public getAllParameterAgama() {
        return this._http.get('api/agamas')
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }
    // get parameter pendidikan
    public getAllParameterpendidikan() {
        return this._http.get('api/pendidikans')
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    // get data Tunjangan karyawan

    public getAllDataTunjanganKaryawanByJenis(p: string, v: string): any {
        return this._http.get('api/kolom_tunjangan_by_jenis?' + p + '=' + v)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    // get Jabatan
    public getJabatans(): any {
        return this._http.get('api/jabatans')
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    // save BPJS, JP, Ketenagakerjaan
    public saveBPJS(data: ParameterBpjsModel) {
        return this._http.put('api/bpjs', JSON.stringify(data));
    }


    // save kolom tunjangan

    public savekolomtunjangan(data: KolomTunjangan) {
        return this._http.post('api/kolom_tunjangan', JSON.stringify(data));
    }

    public updatekolomtunjangan(data: KolomTunjangan) {
        return this._http.put('api/kolom_tunjangan', JSON.stringify(data));
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
}

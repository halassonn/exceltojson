import {Injectable, OnInit} from "@angular/core";

@Injectable()
export class EnvConf {
  public URL_SERVER = this.loadUrlServer();



  loadUrlServer(): string {

    /*var alamat = localStorage.getItem('server');
    if (alamat !== null) {

      if (!JSON.parse(alamat).alamat.endsWith('/')) {
        return JSON.parse(alamat).alamat + '/';
      } else {
        return JSON.parse(alamat).alamat;
      }
    }*/
    return 'http://localhost:3000/';
    //return 'https://dioriapi.herokuapp.com/api/';
    //return 'http://bprdiorigandapt.sytes.net:8585/diori-ganda-api/';
    //return 'http://192.168.88.52:8080/cvsatya-Adm-App/api/';
  }


}

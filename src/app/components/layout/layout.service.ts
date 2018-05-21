import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
@Injectable()
export class LayoutService {
  title = 'Home';
  public mynav: any;
  constructor(private router: Router) {

  }
  back_home() {
    this.router.navigateByUrl('/layout/home');
  }
  open_route(m_url: string) {
    switch (m_url) {
      case 'users': {
        // statements;
        this.router.navigateByUrl('/layout/users');
        this.title = 'Data User';
        break;
      }
      case 'data_kantor': {
        // statements;
        this.router.navigateByUrl('/layout/datakantor');
        this.title = 'Data Kantor';
        break;
      }
      case 'data_karyawan': {
        // statements;
        this.router.navigateByUrl('/layout/karyawan');
        this.title = 'Data Karyawan';
        break;
      }
      case 'data_gaji': {
        // statements;
        this.router.navigateByUrl('/layout/penggajian');
        this.title = 'Data Penggajian';
        break;
      }
      case 'data_cetak': {
        // statements;
        this.router.navigateByUrl('/layout/cetak');
        this.title = 'Cetak Data';
        break;
      }
      case 'setting': {
        // statements;
        this.router.navigateByUrl('/layout/setting');
        this.title = '';
        break;
      }
      case 'home': {
        this.title = 'Home';
        this.router.navigateByUrl('/layout/home');
      }
    }
 console.log(this.title);
  }
}

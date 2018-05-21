import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { LoaderService } from '../../core/_http/loader/loader.service';
import { environment } from '../../../environments/environtment';
import { LayoutService } from './layout.service';
import { AuthService } from '../../providers/auth.service';
import { ProfileService } from '../../providers/profile.service';
import { ProfileModel } from '../../model/profile.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  public appVersion;
  url: string = environment.server_host;
  username: any;
  data: ProfileModel[];

  @Input() title = 'Home';

  @ViewChild('sidenav')
  public mynav: MatSidenav;
  constructor(private router: Router, private loaderService: LoaderService, private layoutservice: LayoutService,
    private authservice: AuthService,
    private dtkaryawanservice: ProfileService) {
   this.dtkaryawanservice.updatemasakerja();
  }

  ngOnInit() {

    this.title = this.layoutservice.title;
    console.log(this.layoutservice.title);
    switch (this.title) {
      case 'Data User': {
        // statements;
        this.router.navigateByUrl('/layout/users');
        // this.title = 'Data User';
        break;
      }
      case 'Data Kantor': {
        // statements;
        this.router.navigateByUrl('/layout/datakantor');
        //  this.title = 'Data Kantor';
        break;
      }
      case 'Data Karyawan': {
        // statements;
        this.router.navigateByUrl('/layout/karyawan');
        // this.title = 'Data Karyawan';
        break;
      }
      case 'Data Penggajian': {
        // statements;
        this.router.navigateByUrl('/layout/penggajian');
        //  this.title = 'Data Penggajian';
        break;
      }
      case 'Cetak Data': {
        this.router.navigateByUrl('/layout/cetak');
      }
      // tslint:disable-next-line:no-switch-case-fall-through
      case 'Configuration': {
        this.router.navigateByUrl('/layout/setting');
      }
      // tslint:disable-next-line:no-switch-case-fall-through
      default: {
        this.title = 'Home';
        this.router.navigateByUrl('/layout/home');
      }
    }
  }

  logout() {
    this.authservice.on_logout();
  }

  open_sidemenu() {
    this.mynav.open();
  }
  open_route(m_url: string) {
    this.layoutservice.open_route(m_url);
    this.title = this.layoutservice.title;
    this.mynav.close();
  }

  public set_title(p: string) {
    this.title = p;
  }
  public get_title() {
    return this.title;
  }

  
}

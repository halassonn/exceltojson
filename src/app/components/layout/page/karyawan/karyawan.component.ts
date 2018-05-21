import { Component, ElementRef, OnInit, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import {
  MatPaginator, MatSnackBar, MatSnackBarConfig,
  MatSnackBarVerticalPosition, MatSort, DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS
} from '@angular/material';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { ProfileModel } from '../../../../model/profile.model';
import { LoaderService } from '../../../../core/_http/loader/loader.service';
import { ProfileService } from '../../../../providers/profile.service';
import { SettingService } from '../../../../providers/setting.service';
import { AgamaModel } from '../../../../model/agama.model';

@Component({
  selector: 'app-karyawan',
  templateUrl: './karyawan.component.html',
  styleUrls: ['./karyawan.component.scss']
})
export class KaryawanComponent implements OnInit, AfterViewInit {


  viewstyle: {
    'v1': 'view_table', 'v2': 'box'
  }
  view = 'box';

  displayedColumns: any;
  dataSource: any;
  datakaryawanDB: any;
  datasort: DataSourceSort | null;
  nik = '';

  page = true;
  showdetail = false;
  showmodal = false;
  updateData = false;
  showformadd = false;
  showmodaldelete = false;
  showcari = false;
  disable = true;

  classmodal = 'cmodal2';
  classmodalcari = 'cmodal-cari';
  position_tooltip: any = 'after';

  masakerja: any;
  masakerjath: any;
  masakerjabl: any;
  url_foto: any;
  pendidikan: any;

  mindate = new Date('1946-01-01T09:00:00');
  maxdate = new Date('2002-12-31T09:00:00');
  defaultimgae = './assets/img/default.png';

  ms: any;
  cari: any = '';
  public file_srcs = '';
  num: any;

  formaddkaryawan: FormGroup;

  datakaryawan: ProfileModel = new ProfileModel;
  public datakaryawans: ProfileModel[];
  agamas: any;
  jabatans: any;
  pendidikans: any;



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;


  matSnackBarVerticalPosition: MatSnackBarVerticalPosition = 'top';
  snackBarSuccesConf: MatSnackBarConfig = {
    duration: 3000,
    extraClasses: ['success-snackbar'],
    verticalPosition: this.matSnackBarVerticalPosition
  };
  snackBarErrorConf: MatSnackBarConfig = {
    duration: 3000,
    extraClasses: ['error-snackbar'],
    verticalPosition: this.matSnackBarVerticalPosition
  };



  constructor(private loaderService: LoaderService,
    private profileService: ProfileService,
    private settingService: SettingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe) {
    this.displayedColumns = ['foto', 'nik', 'nama', 'jenkel', 'tempatlahir', 'jabatan', 'statuskaryawan', 'actions'];


  }


  ngOnInit() {
    console.log(this.maxdate);
    /*this.profileService.getEmittedValue().subscribe(
      (data) => {
        this.pageclass = data;
      }
    );*/

    this.getParameterAgama();
    this.getParameterJabatan();
    this.getParameterPendidikan();

    this.buildform(null);


  }
  ngAfterViewInit() {

    this.getAllProfiles(null, null);
  }

  changeview() {

    this.view = 'view_table';
    this.getAllProfiles(null, null);
    this.displayedColumns = ['foto', 'nik', 'nama', 'jenkel', 'tempatlahir', 'jabatan', 'statuskaryawan', 'actions'];


  }

  buildform(data: ProfileModel) {
    if (data == null) {
      this.formaddkaryawan = this.fb.group({
        'id': ['', Validators.required],
        'nik': [localStorage.getItem('kodekantor'), Validators.required],
        'nama': ['', Validators.required],
        'tempatlahir': ['', Validators.required],
        'alamat': ['', Validators.required],
        'tgllahir': ['', Validators.required],
        'jabatan': ['', Validators.required],
        'jenkel': ['', Validators.required],
        'agama': ['', Validators.required],
        'status': ['', Validators.required],
        'statuskaryawan': ['', Validators.required],
        'gol': ['', Validators.required],
        'tglmasuk': ['', Validators.required],
        'pendidikan': ['', Validators.required],
        'email': ['', Validators.email],
        'notelp': ['', Validators.maxLength(12)]
      });
      // tslint:disable-next-line:no-bitwise
      this.masakerja = '';
      this.masakerjath = '';
      this.masakerjabl = '';
      this.file_srcs = this.defaultimgae;
      this.url_foto = null;
    } else {
      this.formaddkaryawan = this.fb.group({
        'id': [data.id, Validators.required],
        'nik': [{ value: data.nik, disabled: this.disable }],
        'nama': [{ value: data.nama, disabled: this.disable }, Validators.required],
        'tempatlahir': [{ value: data.tempatlahir, disabled: this.disable }, Validators.required],
        'alamat': [{ value: data.alamat, disabled: this.disable }, Validators.required],
        'tgllahir': [{ value: new Date(data.tgllahir), disabled: this.disable }, Validators.required],
        'jabatan': [{ value: data.jabatan, disabled: this.disable }, Validators.required],
        'jenkel': [data.jenkel, Validators.required],
        'agama': [data.agama, Validators.required],
        'status': [data.status, Validators.required],
        'statuskaryawan': [data.statuskaryawan, Validators.required],
        'gol': [data.gol, Validators.required],
        'tglmasuk': [{ value: new Date(data.tglmasuk), disabled: this.disable }, Validators.required],
        'pendidikan': [data.pendidikan, Validators.required],
        'email': [{ value: data.email, disabled: this.disable }, Validators.email],
        'notelp': [{ value: data.notelp, disabled: this.disable }]
      });
      this.masakerjath = data.masakerja.substring(0, 2);
      this.masakerjabl = data.masakerja.substring(3, 6);
      this.nik = data.nik;
      this.url_foto = data.foto;
      this.file_srcs = this.rebuildImgsrc(data.foto);
    }
  }

  doSomething(newDate) {
    this.newnik(newDate);
  }


  getAllProfiles(by: any, param: any) {

    this.loaderService.status('Fetch Data Karyawan...');
    this.loaderService.loaderOpen();
    setTimeout(() => {
      this.datakaryawans = null;
      const x = this.profileService.getAllDataKaryawan();
      x.subscribe(
        (data) => {
          this.datakaryawans = data;
        }
      )

      this.datakaryawanDB = new DataKaryawanDatabase(x, this.loaderService, by, param);
      // pagination
      this.datasort = new DataSourceSort(this.datakaryawanDB, this.sort, this.paginator);
      this.dataSource = this.datasort;
      this.loaderService.loaderclose();
    }, 2500);

  }

  imageUploaded(file: any) {
    this.imageRemove(file);
    const typefile = file.file.type;
    this.file_srcs = file.src;
    if (typefile === 'image/jpg') {
      this.url_foto = file.src.replace('data:image/jpg;base64,', 'jpgg');
    } else if (typefile === 'image/png') {
      this.url_foto = file.src.replace('data:image/png;base64,', 'pngg');
    } else if (typefile === 'image/jpeg') {
      this.url_foto = file.src.replace('data:image/jpeg;base64,', 'jpeg');
    } else {
      this.url_foto = null;
      console.log('file anda salah');
    }
    console.log(this.url_foto.substring(0, 4));
  }



  rebuildImgsrc(surl: string) {
    if (surl !== null) {
      const typedata = surl.substring(0, 4);
      if (typedata === 'jpgg') {
        return surl.replace(typedata, 'data:image/jpg;base64,');
      } else if (typedata === 'pngg') {
        return surl.replace(typedata, 'data:image/png;base64,');
      } else if (typedata === 'jpeg') {
        return surl.replace(typedata, 'data:image/jpeg;base64,');
      } else {
      }
    } else {
      return this.defaultimgae;
    }

  }

  imageRemove(file: any) {
    this.file_srcs = null;
  }


  savedata(event) {
    this.loaderService.status('Save ........');
    this.datakaryawan = event;
    this.datakaryawan.nik = this.nik;
    this.datakaryawan.foto = this.url_foto;
    this.datakaryawan.masakerja = this.numFunction(this.masakerjath) + 'T ' + this.numFunction(this.masakerjabl) + 'B';
    // console.log(JSON.stringify(this.datakaryawan));

    if (this.datakaryawan.id === null || this.datakaryawan.id === '') {
      this.profileService.saveDatakaryawan(this.datakaryawan).subscribe(
        (res) => {
          const success = JSON.parse(res._body);
          console.log(success.body);
          if (success.statusCodeValue === 201) {
            this.snackBar.open(success.body, '', this.snackBarSuccesConf);
            this.buildform(null);
            this.showformadd = !this.showformadd;
            this.getAllProfiles(null, null);
          } else {
            this.snackBar.open(success.body, '', this.snackBarErrorConf);
          }
        },
        (err2) => {
          const err = JSON.parse(err2._body);
          console.error(err.message);
          this.snackBar.open(err.message, '', this.snackBarErrorConf);
        }
      );
    } else {
      this.profileService.updateDataKaryawan(this.datakaryawan).subscribe(
        (res) => {
          const success = JSON.parse(res._body);
          console.log(success.body);
          this.snackBar.open(success.body, '', this.snackBarSuccesConf);
          this.buildform(null);
          this.showformadd = !this.showformadd;
          this.getAllProfiles(null, null);
        },
        (err2) => {
          const err = JSON.parse(err2._body);
          console.error(err.message);
          this.snackBar.open(err.message, '', this.snackBarErrorConf);
        }
      );
    }
    this.disable = true;
  }
  newnik(event) {
    console.log(
      localStorage.getItem('kodekantor').concat(
        this.datePipe.transform(event.value, 'dd/MM/yyyy').substr(3, 2)
          .concat(this.datePipe.transform(event.value, 'dd/MM/yyyy').substr(6, 4))
      )
    );
    this.nik = localStorage.getItem('kodekantor').concat(
      this.datePipe.transform(event.value, 'dd/MM/yyyy').substr(3, 2)
        .concat(this.datePipe.transform(event.value, 'dd/MM/yyyy').substr(6, 4))
    );
    // this.buildform( null);

  }
  getmasakerja(event) {

    const tgl1: any = this.datePipe.transform(event.value, 'dd-MM-yyyy');
    const tgl2: any = this.datePipe.transform(new Date(), 'dd-MM-yyyy');

    console.log('tgl1 ' + tgl1);
    console.log('tgl2 ' + tgl2);
    const parts1 = tgl1.split('-');
    const date1: any = new Date(parseInt(parts1[2], 10),     // year

      parseInt(parts1[1], 10) - 1, // month, starts with 0

      parseInt(parts1[0], 10));    // day
    console.log('date1 ' + date1);


    const parts2 = tgl2.split('-');

    const date2: any = new Date(parseInt(parts2[2], 10),     // year

      parseInt(parts2[1], 10) - 1, // month, starts with 0

      parseInt(parts2[0], 10));    // day
    console.log('date2 ' + date2);

    let yeardiff = 0;

    let monthdiff = 0;

    let daydiff = 0;

    let weekdiff = 0;

    yeardiff = parseInt(parts2[2], 10) - parseInt(parts1[2], 10);
    console.log('yeardiff ' + yeardiff);

    if (yeardiff > 0) {

      // Change Year

      monthdiff = parseInt(parts2[1], 10) + 12 - parseInt(parts1[1], 10);
      console.log('monthdiff ' + monthdiff);
    } else {

      monthdiff = parseInt(parts2[1], 10) - parseInt(parts1[1], 10);
      console.log('monthdiff ' + monthdiff);
    }

    if (monthdiff > 0) {

      if (parseInt(parts2[0], 10) >= parseInt(parts1[0], 10)) {

        daydiff = parseInt(parts2[0], 10) - parseInt(parts1[0], 10);
        console.log('daydiff ' + daydiff);
      } else {

        monthdiff--;

        const diff: any = new Date(date2 - date1);
        // tslint:disable-next-line:no-shadowed-variable
        const daydiff = diff / 1000 / 60 / 60 / 24;
        console.log('daydiff ' + daydiff);
      }

    } else {

      daydiff = parseInt(parts2[0], 10) - parseInt(parts1[0], 10);
      console.log('daydiff ' + daydiff);
    }
    if (daydiff >= 7) {

      weekdiff = Math.floor(daydiff / 7);

      daydiff = daydiff % 7;
      console.log('daydiff ' + daydiff);
    }

    const tahun = yeardiff;
    const bulan = monthdiff;
    const hari = daydiff;
    const weekly = weekdiff;




    console.log(hari + ' Hari ' + weekly + ' Minggu ' + bulan + ' Bulan ' + tahun + ' tahun ');

    this.masakerjath = this.numFunction(tahun);
    if (bulan < 0) {
      this.snackBar.open('Tanggal Masuk Salah', '', this.snackBarErrorConf);
      this.masakerjabl = '';
      this.masakerjath = '';
    } else {


      if (bulan >= 12) {
        console.log('BULAN ' + bulan % 12);
        this.masakerjabl = this.numFunction(bulan % 12);

      } else if (bulan < 12 && tahun > 0) {
        this.masakerjath = this.numFunction(tahun - 1);
        this.masakerjabl = this.numFunction(bulan);
      } else {
        this.masakerjath = this.numFunction(tahun);
        this.masakerjabl = this.numFunction(bulan);
      }

    }


  }

  openside() {
    this.profileService.sideOpen();
  }
  closeside() {
    this.profileService.sideclose();
  }
  showDetail(datakaryawan: ProfileModel) {
    this.file_srcs = this.rebuildImgsrc(datakaryawan.foto);
    this.datakaryawan = datakaryawan;
    this.masakerja = datakaryawan.masakerja;
    this.showdetail = !this.showdetail;
  }
  showEdit(datakaryawan: ProfileModel) {
    this.buildform(datakaryawan);
    this.datakaryawan = datakaryawan;
    this.showformadd = !this.showformadd;
    this.masakerja = datakaryawan.masakerja;
    // this.masakerjath = parseInt((this.masakerja / 12).toString(), 10);
    // this.masakerjabl = this.masakerja - (parseInt((this.masakerja / 12).toString(), 10) * 12);
    this.updateData = true;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  applyFilter2(filterValue: string) {
    const datalist = this.datakaryawans;
    const search = datalist.filter(data => data.nik === filterValue.trim() || data.nama === filterValue.trim());
    if (search.length !== 0) {
      this.datakaryawans = search;
    } else {
      this.getAllProfiles(null, null);
    }

  }

  hapusDataKaryawan(datakaryawan: ProfileModel) {
    this.showmodaldelete = !this.showmodaldelete;
    this.datakaryawan = datakaryawan;
  }

  doDelete() {
    this.profileService.deleteDataKaryawan(this.datakaryawan.id).subscribe(
      (res) => {
        this.snackBar.open('Data Karyawan ' + this.datakaryawan.nama + ' Sudah Dihapus', '', this.snackBarSuccesConf);
        this.getAllProfiles(null, null);

      },
      (err) => {
        this.snackBar.open(err, '', this.snackBarErrorConf);
      }
    );
    this.showmodaldelete = !this.showmodaldelete;
  }
  openformkaryawan() {
    console.log('baru');
    this.disable = false;
    this.buildform(null);
    this.updateData = false;
    this.showformadd = !this.showformadd;
  }

  edit_data() {
    this.updateData = false;
    this.disable = false;
    this.buildform(this.datakaryawan);
  }

  batal() {
    if (this.updateData === false && this.disable === false) {
      this.updateData = false;
      this.disable = true;
      console.log('tombol edit  ditekan');
    } else {
      console.log('tombol edit tidak ditekan');
    }
    this.buildform(null);
    this.showformadd = !this.showformadd;
  }
  opencari() {
    this.cari = '';
    this.showcari = !this.showcari;
  }

  numFunction(n: any) {
    this.num = parseInt(n, 10);
    if (isNaN(this.num)) {
      return n;
    }
    // tslint:disable-next-line:label-position
    // num = '' + num;
    console.log(this.num + 'lenght ' + this.num.toFixed().length);
    if (this.num.toFixed().length > 0 && this.num.toFixed().length < 2) {
      this.num = '0' + this.num;
    }
    return this.num;
  }


  getParameterJabatan() {

    this.settingService.getAllParameterJabatan().subscribe(
      (data) => {
        this.jabatans = data.body;
      }
    );

  }

  getParameterAgama() {

    this.settingService.getAllParameterAgama().subscribe(
      (data) => {
        this.agamas = data.body;
        console.log(this.agamas);
      }
    );

  }

  getParameterPendidikan() {

    this.settingService.getAllParameterpendidikan().subscribe(
      (data) => {
        this.pendidikans = data.body;
        console.log(this.pendidikans);
      }
    );

  }

  check_gol_by_pendidikan(e) {
    console.log(e.pendidikan);
    console.log(this.masakerja);
    console.log(e.gol);
    if (e.pendidikan !== '' || this.masakerja !== '') {
      if (
        e.pendidikan === 'SMA' && Number(this.masakerja.substr(0, 2)) < 4 && e.gol !== '2a') {
        this.snackBar.open('Golongan tidak sesuai untu masa kerja baru (' + e.pendidikan + ')', '', this.snackBarErrorConf);
      }

    } else {
      this.snackBar.open('Pendidikan dan Tgl Masuk tidak boleh kosong', '', this.snackBarErrorConf);
    }

  }
}

// database
export class DataKaryawanDatabase {

  dataChange: BehaviorSubject<ProfileModel[]> = new BehaviorSubject<ProfileModel[]>([]);


  constructor(private profile: Observable<ProfileModel[]>, private loaderservice: any, by: any, param: any) {
    this.profile.subscribe(
      (data) => {
        this.dataChange.next(data);
      }
    )




  }



  get data(): ProfileModel[] {
    return this.dataChange.value;
  }
}

export class DataSourceSort extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  constructor(private _datakaryawandatabase: DataKaryawanDatabase, private _sort: MatSort, private _paginator: MatPaginator) {
    super();
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  connect(): Observable<ProfileModel[]> {
    const displayDataChanges = [
      this._datakaryawandatabase.dataChange,
      this._paginator.page,
      this._sort.sortChange,
      this._filterChange
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._datakaryawandatabase.data.slice();

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize)
        .sort((a, b) => {
          const propertyA: number | string = '';
          const propertyB: number | string = '';

          /*switch (this._sort.active) {
            case 'kodekantor':
              [propertyA, propertyB] = [a.kodekantor, b.kodekantor];
              break;
            case 'namakantor':
              [propertyA, propertyB] = [a.namakantor, b.namakantor];
              break;
            case 'alamat':
              [propertyA, propertyB] = [a.alamat, b.alamat];
              break;
            case 'kodepos':
              [propertyA, propertyB] = [a.kodepos, b.kodepos];
              break;

          } */

          const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

          return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);


        })
        .filter((item: ProfileModel) => {
          const searchStr = (item.nik + item.nama + item.jabatan + item.email + item.statuskaryawan
            + item.status + item.jenkel).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
    });


  }

  disconnect() {
  }

}

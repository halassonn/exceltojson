import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatakantorModel } from '../../../../model/datakantor.model';
import { MatPaginator, MatSort, MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarConfig } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { DatakantorService } from '../../../../providers/datakantor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../core/_http/loader/loader.service';
import { ModalService } from '../../../modal/providers/modal.service';

@Component({
  selector: 'app-datakantor',
  templateUrl: './datakantor.component.html',
  styleUrls: ['./datakantor.component.scss']
})
export class DatakantorComponent implements OnInit {
  pageclass: any = 'page-container-full';
  displayedColumns: any;
  datakantorDB: any;
  dataSource: any;
  datasort: DataKantorSourceSort | null;
  formdatakantor: FormGroup;
  datakantor: DatakantorModel = new DatakantorModel;
  page = true;
  showmodal = false;
  updateData = false;
  showformadd = false;
  showcari = false;
  classmodal = 'cmodal2';
  classmodalcari = 'cmodal-cari';
  position_tooltip: any = 'after';
  disable = true;
  cari: any;


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


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  constructor(private loaderService: LoaderService,
    private datakantorService: DatakantorService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private modalservice: ModalService
  ) {
    this.displayedColumns = ['kodekantor', 'namakantor', 'alamat', 'kodepos', 'actions'];
  }

  ngOnInit() {

    this.datakantorService.getEmittedValue().subscribe(
      (data) => {
        this.pageclass = data;
        console.log(data);
      }
    );
    this.getAllDataKantor(null, null);
    this.buildForm(null);
  }

  buildForm(data: DatakantorModel) {
    if (data == null) {
      this.formdatakantor = this.fb.group({
        'id': [''],
        'kodekantor': ['', Validators.required],
        'namakantor': ['', Validators.required],
        'alamat': ['', Validators.required],
        'kodepos': ['']
      });
    } else {
      this.formdatakantor = this.fb.group({
        'id': [data.id],
        'kodekantor': [{ value: data.kodekantor, disabled: this.disable }, Validators.required],
        'namakantor': [{ value: data.namakantor, disabled: this.disable }, Validators.required],
        'alamat': [{ value: data.alamat, disabled: this.disable }, Validators.required],
        'kodepos': [{ value: data.kodepos, disabled: this.disable }, Validators.required]
      });
    }


  }
  addDatakantor(event) {
    this.loaderService.status('Save ........');
    this.datakantor = event;
    console.log('id' + this.datakantor.id);
    if (this.datakantor.id == null || this.datakantor.id === '') {
      this.datakantorService.addDataKantor(this.datakantor).subscribe(
        (res) => {
          const success = JSON.parse(res._body);
          console.log(success.body);
          if (success.statusCodeValue === 201) {
            this.snackbar.open(success.body, '', this.snackBarSuccesConf);
            this.buildForm(null);
            this.showformadd = !this.showformadd;
            this.getAllDataKantor(null, null);
          } else {
            this.snackbar.open(success.body, '', this.snackBarErrorConf);
          }
        },
        (err2) => {
          const err = JSON.parse(err2._body);
          console.error(err.message);
          this.snackbar.open(err.message, '', this.snackBarErrorConf);
        }
      );
    } else {
      this.datakantorService.updateDataKantor(this.datakantor).subscribe(
        (res) => {
          const success = JSON.parse(res._body);
          console.log(success.body);
          this.snackbar.open(success.body, '', this.snackBarSuccesConf);
          this.disable = true;
          this.buildForm(null);
          this.showformadd = !this.showformadd;
          this.getAllDataKantor(null, null);
        },
        (err2) => {
          const err = JSON.parse(err2._body);
          console.error(err.message);
          this.snackbar.open(err.message, '', this.snackBarErrorConf);
        }
      );
    }

    /*
     */
  }

  showDetail(datakantor: DatakantorModel) {
    this.buildForm(datakantor);
    this.datakantor = datakantor;
    this.openform();
    this.updateData = !this.updateData;
  }
  form_baru() {
    this.buildForm(null);
    this.openform();
  }
  edit_data() {
    this.updateData = !this.updateData;
    this.disable = false;
    this.buildForm(this.datakantor);
  }
  batal() {
    if (this.updateData) {
      this.updateData = this.updateData;
    } else {
      this.updateData = !this.updateData;
    }
    this.disable = true;
    this.buildForm(null);
    this.modalservice.setTitle(!this.showformadd);
    this.showformadd = !this.showformadd;

  }

  hapusDataKantor(datakantor: DatakantorModel) {
    this.showmodal = !this.showmodal;
    this.datakantor = datakantor;
  }
  doDelete() {
    this.datakantorService.deleteDataKantor(this.datakantor.id).subscribe(
      (res) => {
        this.snackbar.open('Data Kantor ' + this.datakantor.kodekantor + ' Sudah Dihapus', '', this.snackBarSuccesConf);
        this.getAllDataKantor(null, null);

      },
      (err) => {
        this.snackbar.open(err, '', this.snackBarErrorConf);
      }
    );
    this.showmodal = !this.showmodal;
  }

  getAllDataKantor(by: any, param: any) {
    this.loaderService.status('Get All Data ...');
    this.datakantorDB = new DataKantorDatabase(this.datakantorService, this.loaderService, by, param);

    // pagination
    this.datasort = new DataKantorSourceSort(this.datakantorDB, this.sort, this.paginator);
    this.dataSource = this.datasort;


  }
  openside() {
    this.datakantorService.sideOpen();

  }
  closeside() {
    this.datakantorService.sideclose();
    this.buildForm(null);
    if (this.updateData === true) {
      this.updateData = !this.updateData;
      console.log(this.updateData);
    }

  }

  openform() {
    if (this.updateData) {
      this.updateData = !this.updateData;
    } else {
      this.updateData = this.updateData;
    }
    this.modalservice.setConf('dialog-form', 450);
    this.modalservice.setTitle(!this.showformadd, 'judul');
    this.showformadd = !this.showformadd;
  }
  opencari() {
    this.showcari = !this.showcari;
    this.cari = '';
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}


// database
export class DataKantorDatabase {

  dataChange: BehaviorSubject<DatakantorModel[]> = new BehaviorSubject<DatakantorModel[]>([]);

  constructor(private datakantor: DatakantorService, private loaderService: LoaderService, by: any, param: any) {
    // Fill up the database.
    if (param !== null) {
      this.datakantor.getAllDataKantorBy(by, param).subscribe((data) => this.dataChange.next(data));
    } else {
      this.datakantor.getAllDataKantor().subscribe((data) => this.dataChange.next(data));
    }

  }

  get data(): DatakantorModel[] {
    return this.dataChange.value;
  }
}

// datasource

export class DataKantorSourceSort extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  constructor(private _datakantorDatabase: DataKantorDatabase, private _sort: MatSort, private _paginator: MatPaginator) {
    super();
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  connect(): Observable<DatakantorModel[]> {
    const displayDataChanges = [
      this._datakantorDatabase.dataChange,
      this._paginator.page,
      this._sort.sortChange,
      this._filterChange
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._datakantorDatabase.data.slice();

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
        .filter((item: DatakantorModel) => {
          const searchStr = (item.kodekantor + item.namakantor + item.alamat + item.kodepos).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
    });


  }

  disconnect() {
  }

}


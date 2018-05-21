import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from './app.config';

type AOA = any[][];
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {


  searchString = ['1', '2', '3', '4'];
  wilayahAO = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'SheetJS.xlsx';
  data2 = [];
  data3 = [];
  dataAOA: AOA = [];
  keys = [];
  subtotal = 0;
  numberindex: any;
  pdfUrl: any;
  filterkey = [];
  puredata: any;
  model = [];
  printerlist: any;
  datakantormodel: DatakantorModel = new DatakantorModel;
  datakantor: any;
  urlfile = true;
  showloading = false;
  showMessage = false;
  messageclass: any;
  target: DataTransfer;
  reader: FileReader;


  printoption = {
    silent: false,
    printBackground: '',
    deviceName: ''
  }
  @ViewChild('dataprint') dataprint: ElementRef;




  constructor(public electronService: ElectronService,
    private translate: TranslateService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
      this.getAppVersion();
    } else {
      // console.log('Mode web');
    }
    this.datakantor = JSON.parse(localStorage.getItem('datakantor'));
    if (this.datakantor !== null) {
      this.datakantormodel.namabpr = this.datakantor.namabpr;
      this.datakantormodel.namapimpinan = this.datakantor.namapimpinan;
      this.datakantormodel.namakasubag = this.datakantor.namakasubag;
      this.datakantormodel.namapetugas = this.datakantor.namapetugas;
    }



  }

  getAppVersion() {
    this.electronService.ipcRenderer.send('getAppVersion');
    this.electronService.ipcRenderer.on('getdata', (event, arg) => {
      // console.log('App Version', arg);
    });
  }
  selectprint(e) {
    this.printoption.deviceName = e.target.value;
    console.log(this.printoption);
  }
  directornot(e) {
    this.printoption.silent = Boolean(e.target.value);
    console.log(this.printoption);
  }

  onPrint() {

    setTimeout(() => {

      this.electronService.ipcRenderer.send('print', null);

    }, 1000);

  }


  onFileChange(evt: any) {
    this.keys = [];

    /* wire up file reader */
    this.target = <DataTransfer>(evt.target);
    if (this.target.files.length !== 1) {
      this.urlfile = true;
      throw new Error('Cannot use multiple files');
     }
    this.reader = new FileReader();
    this.reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.dataAOA = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1, raw: true }));
      this.data2 = XLSX.utils.sheet_to_json(ws, { raw: true });
      this.puredata = XLSX.utils.sheet_to_json(ws, { raw: true });
      // this.data.shift();
      // console.log(this.data2);
      this.getkey(this.data2[0]);



      // tslint:disable-next-line:forin
      for (const i in this.wilayahAO) {
        // tslint:disable-next-line:forin
        for (const kolek in this.searchString) {
          // console.log(this.data2.filter((x) => x.MKTOFFR === this.wilayahAO[i] && x.KOLEK === this.searchString[kolek]));
          this.data.push(<AOA>(this.data2.filter((x) => x.MKTOFFR === this.wilayahAO[i] && x.KOLEK === this.searchString[kolek])));
          // console.log(this.data);
        }
      }
      // console.log(this.data.filter((x) => x.MKTOFFR === this.wilayahAO[0]));
    };
    this.reader.readAsBinaryString(this.target.files[0]);
    this.urlfile = false;
    this.target = null;
  }
  ngAfterViewInit() {
    // console.log(this.stp.nativeElement);


    console.log(this.datakantormodel);
  }
  ngOnInit() {
    this.pdfUrl = './assets/aktr0016.pdf';
    this.electronService.ipcRenderer.send('get_printer_list');
    this.electronService.ipcRenderer.on('printer_list', (e, data) => {
      console.log(data);
      this.printerlist = data;
    })
  }


  subtotalfunc(index) {
    this.subtotal += Number(index);
    return this.subtotal || 0;
  }
  numbering(e) {
    this.numberindex = Number(e) + 1;
    // console.log(this.numberindex);
    return Number(e) + 1;
  }
  getFilter(e) {
    const d = e[0];
    if (d !== undefined) {
      return d.MKTOFFR;
    }
    return '';
  }

  getFilterByKOLEK(e) {
    const d = e[0];
    if (d !== undefined) {
      return d.KOLEK;
    }
    return '';
  }
  getTotal(e: string) {
    let i = this.data2.length;
    let total = 0;

    // tslint:disable-next-line:curly
    if (e === 'PLAFOND') {
      while (i--) {
        total += this.data2[i].PLAFOND;
        // console.log(total);
      }
    } else if (e === 'BAKIDEBET') {
      while (i--) {
        total += this.data2[i].BAKIDEBET;
        // console.log(total);
      }
    } else if (e === 'TGK_PKK') {
      while (i--) {
        total += this.data2[i].TGK_PKK;
        // console.log(total);
      }
    } else if (e === 'TGK_BNG') {
      while (i--) {
        total += this.data2[i].TGK_BNG;
        // console.log(total);
      }
    } else if (e === 'DENDA') {
      while (i--) {
        total += this.data2[i].DENDA;
        // console.log(total);
      }
    }

    // total += this.data2[i].e;

    return total;
  }

  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  getkey(datajson) {

    // tslint:disable-next-line:forin
    for (const key in datajson) {
      this.keys.push(key);
    }
  }



  fiterdataBy(e) {


    if (e.target.checked) {

      switch (e.target.value) {
        case 'KODEPRODUK': {
          this.puredata.forEach(function (item) {
            delete item.KODEPRODUK;
          });
          break;
        }
        case 'NAMA': {
          this.puredata.forEach(function (item) {
            delete item.NAMA;
          });
          break;
        }



      }

      //this.filterkey.push(e.target.value);



    } else {
      this.filterkey = this.filterkey.filter((xx) => {
        return xx !== e.target.value
      });
    }
    // console.log(this.filterkey);
    console.log(this.puredata);


  }



  sendataPrint() {
    this.showloading = true;
    setTimeout(() => {
      const x = this.dataprint.nativeElement;
      this.electronService.ipcRenderer.send('open-print-preview', document.getElementById('dataprint').innerHTML);
      this.electronService.ipcRenderer.send('data_json', this.data2);
      this.showloading = false;
      this.urlfile = true;
    }, 1000);

  }
  sendataPrint2() {
    this.electronService.ipcRenderer.send('direct_to_print', this.printoption);
  }


  saveDatakantor() {

    this.showloading = true;
    setTimeout(() => {
      console.log(this.datakantormodel);
      localStorage.setItem('datakantor', JSON.stringify(this.datakantormodel));
      this.datakantor = localStorage.getItem('datakantor');
      this.showloading = false;
      this.showMessage = true;
      this.messageclass = ' messagepane';
    }, 800);

  }
  batal() {
    this.datakantor = JSON.parse(localStorage.getItem('datakantor'));
  }
  outmessage() {
    this.showMessage = false;
  }

  showsetting() {

    this.datakantor = '';
  }
}


export class DatakantorModel {
  namabpr: string;
  namapimpinan: string;
  namakasubag: string;
  namapetugas: string;
}

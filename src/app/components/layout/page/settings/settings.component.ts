import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { KolomTunjangan } from '../../../../model/kolomtunjangan.model';
import { MatSnackBarVerticalPosition, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { LayoutService } from '../../layout.service';
import { SettingService } from '../../../../providers/setting.service';
import { MyCurrencyPipe } from '../../../../core/pipe/my-currency.pipe';
import { Router } from '@angular/router';
import { ParameterJenisTunjanganKaryawan } from '../../../../model/parameterjenistunjangan.model';
import { ParameterJabatanModel } from '../../../../model/parameterjabatan.model';
import { ParameterKolom } from '../../../../model/parameterkolom.model';
import { ParameterBpjsModel } from '../../../../model/parameterbpjs.model';
import { ParameterPph21Model } from '../../../../model/parameterpph21.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],

  animations: [
    trigger('formadd', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class SettingsComponent implements OnInit {
  panelOpenState = false;
  page = true;
  admin = false;
  showformadd = false;
  showformumum = false;
  iconform: any;
  open_form_add = false;
  tj_jabatan = false;
  show_title_icon = false;
  form_bpjs = false;
  button_title = 'Tambah';
  id_jenis_tunjangan: any = '';
  formname: any;
  kodejenitunjangan: any;

  color = '#DDBDF1';



  title: string;
  classmodal = 'cmodal';

  formTunjangan: FormGroup;
  formTunjangankesehatan: FormGroup;
  formTunjanganjabatan: FormGroup;
  formTunjanganptk: FormGroup;
  formBPJS: FormGroup;

  kolom_tunjangans: KolomTunjangan[];
  kolom_tunjangan: KolomTunjangan = new KolomTunjangan;

  parameterjenis_tunjangans: ParameterJenisTunjanganKaryawan[];
  parameterjenis_tunjangan: ParameterJenisTunjanganKaryawan = new ParameterJenisTunjanganKaryawan;

  parameterjabatans: ParameterJabatanModel[];
  parameterjabatan: ParameterJabatanModel = new ParameterJabatanModel;

  parameterkolom: ParameterKolom = new ParameterKolom;
  parameterkoloms: ParameterKolom[];
  parameterBPJS: ParameterBpjsModel = new ParameterBpjsModel;
  parameterBPJSs: ParameterBpjsModel[];
  parameterPph21: ParameterPph21Model[];




  matSnackBarVerticalPosition: MatSnackBarVerticalPosition = 'top';

  message: any = { succes: false, pesan: '' };
  snackBarSuccesConf: MatSnackBarConfig = {
    duration: 3000,
    extraClasses: ['success-snackbar'],
    verticalPosition: this.matSnackBarVerticalPosition
  };

  snackBarWarnigConf: MatSnackBarConfig = {
    duration: 3000,
    extraClasses: ['warning-snackbar'],
    verticalPosition: this.matSnackBarVerticalPosition
  };
  snackBarErrorConf: MatSnackBarConfig = {
    duration: 3000,
    extraClasses: ['error-snackbar'],
    verticalPosition: this.matSnackBarVerticalPosition
  };

  constructor(private snackBar: MatSnackBar,
    private layoutservice: LayoutService,
    private settingservice: SettingService,
    private fb: FormBuilder,
    private mycurrencyPipe: MyCurrencyPipe,
    private router: Router) {
    if (localStorage.getItem('kodekantor') === '585') {
      this.admin = true;
    }
    this.getallParameterjenistunjangan();
    this.getallParameterJabatans();
    this.getallParameterKolomTunjangan();
    this.getallParameterBPJS();
    this.getallParameterPPH21();

  }

  ngOnInit() {

    this.builformtunjangan(this.kolom_tunjangan);
    this.buildformBPJS(this.parameterBPJS);
    this.getAllTunjangan('jenis_tunjangan', this.title);
  }

  builformtunjangan(data?: KolomTunjangan) {

    this.formTunjangan = this.fb.group({
      'id': [data.id || ''],
      'persen': [data.persen || '', Validators.required]
    });

    this.formTunjangankesehatan = this.fb.group({
      'id': [data.id || ''],
      'persen': [data.persen || '', Validators.required],
      'status': [data.status || '', Validators.required],
    });
    this.formTunjanganjabatan = this.fb.group({
      'id': [data.id || ''],
      'nominal': [this.mycurrencyPipe.transform(data.nominal) || '', Validators.required],
      'jabatan': [data.jabatan || '', Validators.required]
    });
    this.formTunjanganptk = this.fb.group({
      'id': [data.id || ''],
      'nominal': [this.mycurrencyPipe.transform(data.nominal) || '', Validators.required],
      'kolom': [data.kolom || '', Validators.required],
    });

  }
  buildformBPJS(data?: ParameterBpjsModel) {
    this.formBPJS = this.fb.group({
      'id': [data.id || ''],
      'title': [data.title || '', Validators.required],
      'perusahaan': [data.perusahaan || '', Validators.required],
      'karyawan': [data.karyawan || '', Validators.required]
    });
  }




  open_form(data: ParameterJenisTunjanganKaryawan) {

    this.id_jenis_tunjangan = data.id;
    this.title = data.jenistunjangan;
    this.kodejenitunjangan = data.kode;
    this.parameterjenis_tunjangan = data;

    this.getAllTunjangan('jenis_tunjangan', this.title);
    if (this.showformadd === false) {
      this.batal();
    }

    this.builformtunjangan(this.kolom_tunjangan);
    this.buildformBPJS(this.parameterBPJS);

    console.log('open form ' + data.jenistunjangan);
    console.log('showformadd', this.showformadd);
  }
  open_form_umum(event, icon) {
    this.formname = event;
    this.showformumum = !this.showformumum;
    this.title = event;
    this.iconform = icon;
    this.ngOnInit();
    if (this.parameterjenis_tunjangans === null) {
      this.getallParameterjenistunjangan();
      this.getallParameterJabatans();
      this.getallParameterKolomTunjangan();
    }
  }
  batal(p?: string) {
    if (p === 'form_umum') {
      this.showformumum = !this.showformumum;
    } else {
      if (this.open_form_add === true) {
        this.open_form_add = !this.open_form_add;
      }
      this.button_title = 'Tambah';
    }
  }
  close(p?: string) {
    if (p === 'form_umum') {
      this.showformumum = !this.showformumum;
      this.parameterjenis_tunjangans = null;

      if (this.showformadd === true) {
        this.showformadd = !this.showformadd;
      }
      if (this.open_form_add === true) {
        this.kolom_tunjangan = new KolomTunjangan;
        this.open_form_add = !this.open_form_add;
        this.button_title = 'Tambah';
      }
      this.ngOnInit();
    }
    this.button_title = 'Tambah';
  }


  closeMainPage() {
    this.page = !this.page;
    this.router.navigateByUrl('/layout/home');
  }


  getallParameterjenistunjangan() {
    this.settingservice.getAllParameterJenisTunjanganKaryawan().subscribe(
      (res) => {
        if (res.statusCodeValue === 200) {
          this.parameterjenis_tunjangans = res.body;
        }
      }
    );
  }

  getallParameterAgama() {

  }
  getallParameterBPJS() {
    this.settingservice.getAllParameterBpjs().subscribe(
      (data) => {
        this.parameterBPJS = new ParameterBpjsModel;
        this.parameterBPJSs = data.body;
      }
    )
  }
  getallParameterPPH21() {
    this.settingservice.getAllParameterpph21().subscribe(
      (data) => {
        this.parameterPph21 = data.body;
      }
    )
  }
  getallParameterKolomTunjangan() {
    this.settingservice.getAllParameterKolomTunjangan().subscribe(
      (data) => {
        this.parameterkoloms = data.body;
      }
    )
  }

  getallParameterStatus() {

  }
  getallParameterJabatans() {
    this.settingservice.getJabatans().subscribe(
      (res) => {
        this.parameterjabatans = res.body;
      }
    );
  }

  getAllTunjangan(p: string, v: string) {
    this.settingservice.getAllDataTunjanganKaryawanByJenis(p, v).subscribe(
      (res) => {
        // console.log(res.body);
        this.kolom_tunjangans = res.body;
        if (this.kolom_tunjangans !== null) {
          this.kolom_tunjangans.map((data) => { this.kolom_tunjangan = data; });
          // console.log(this.kolom_tunjangan.id);
        } else {
          this.kolom_tunjangan = new KolomTunjangan;
        }

      });
  }




  prosesSimpanTunjangan(): any {

    if (this.parameterjenis_tunjangan.kode === 'Tis' ||
      this.parameterjenis_tunjangan.kode === 'Tank' || this.parameterjenis_tunjangan.kode === 'THT') {
      this.kolom_tunjangan.id = this.formTunjangan.value.id;
      this.kolom_tunjangan.jenisTunjangan = this.parameterjenis_tunjangan;
      this.kolom_tunjangan.persen = this.formTunjangan.value.persen;
      this.kolom_tunjangan.kolom = this.formTunjangan.value.kolom;

    } else if (this.parameterjenis_tunjangan.kode === 'Tks') {
      this.kolom_tunjangan.id = this.formTunjangankesehatan.value.id;
      this.kolom_tunjangan.jenisTunjangan = this.parameterjenis_tunjangan;
      this.kolom_tunjangan.persen = this.formTunjangankesehatan.value.persen;
      this.kolom_tunjangan.status = this.formTunjangankesehatan.value.status;

    } else if (this.parameterjenis_tunjangan.kode === 'Tjab') {
      this.kolom_tunjangan.id = this.formTunjanganjabatan.value.id;
      this.kolom_tunjangan.jenisTunjangan = this.parameterjenis_tunjangan;
      this.kolom_tunjangan.jabatan = this.formTunjanganjabatan.value.jabatan;
      this.kolom_tunjangan.nominal = this.mycurrencyPipe.transform(this.formTunjanganjabatan.value.nominal);



    } else if (this.parameterjenis_tunjangan.kode === 'Tkhs' ||
      this.parameterjenis_tunjangan.kode === 'Tpang' || this.parameterjenis_tunjangan.kode === 'Ttrans') {
      this.kolom_tunjangan.id = this.formTunjanganptk.value.id;
      this.kolom_tunjangan.jenisTunjangan = this.parameterjenis_tunjangan;
      this.kolom_tunjangan.nominal = this.mycurrencyPipe.transform(this.formTunjanganptk.value.nominal);
      this.kolom_tunjangan.kolom = this.formTunjanganptk.value.kolom;

    }


  }

  on_btn_ok() {
    if (this.formname === 'BPJS Kesehatan/Ketenagakerjaan/Pensiun') {
      this.parameterBPJS = this.formBPJS.value;
      this.parameterBPJS.karyawan = this.formBPJS.value.karyawan + ' %';
      this.parameterBPJS.perusahaan = this.formBPJS.value.perusahaan + ' %';
      this.parameterBPJS.persen = (parseFloat(this.formBPJS.value.karyawan) + parseFloat(this.formBPJS.value.perusahaan)) + ' %';
      console.log(this.parameterBPJS);
      this.settingservice.saveBPJS(this.parameterBPJS).subscribe(
        (res) => {
          // console.log(res);
          if (res.json().statusCodeValue === 200 || res.json().statusCodeValue === 201) {
            this.snackBar.open(res.json().body, '', this.snackBarSuccesConf);
          } else {
            this.snackBar.open(res.json().body, '', this.snackBarWarnigConf);
          }
          this.getallParameterBPJS();
          this.parameterBPJS = new ParameterBpjsModel;
          this.buildformBPJS(this.parameterBPJS);
        },
        (err) => {
          this.snackBar.open(err, '', this.snackBarErrorConf);
        }
      )
    }
  }


  simpanTunjangan() {
    if (this.button_title === 'Simpan') {
      this.prosesSimpanTunjangan();
      if (this.kolom_tunjangan !== null) {
        this.settingservice.savekolomtunjangan(this.kolom_tunjangan).subscribe(
          (res) => {
            // console.log(res);
            if (res.json().statusCodeValue === 200 || res.json().statusCodeValue === 201) {
              this.snackBar.open(res.json().body, '', this.snackBarSuccesConf);
            } else {
              this.snackBar.open(res.json().body, '', this.snackBarWarnigConf);
            }
          },
          (error) => {
            this.snackBar.open(error, '', this.snackBarErrorConf);
          }
        );

      }
      this.open_form(this.parameterjenis_tunjangan);
      // this.batal();

    } else if (this.button_title === 'Update') {
      this.prosesSimpanTunjangan();
      if (this.kolom_tunjangan !== null) {
        this.settingservice.updatekolomtunjangan(this.kolom_tunjangan).subscribe(
          (res) => {
            // console.log(res);
            if (res.json().statusCodeValue === 200 || res.json().statusCodeValue === 201) {
              this.snackBar.open(res.json().body, '', this.snackBarSuccesConf);
            } else {
              this.snackBar.open(res.json().body, '', this.snackBarWarnigConf);
            }
          },
          (error) => {
            this.snackBar.open(error, '', this.snackBarErrorConf);
          }
        );
      }
      this.open_form(this.parameterjenis_tunjangan);
      this.batal();

    } else if (this.button_title === 'Tambah') {
      this.kolom_tunjangan = new KolomTunjangan();
      this.open_form_add = !this.open_form_add;
      this.button_title = 'Simpan';
    }

    this.builformtunjangan(this.kolom_tunjangan);
    this.getAllTunjangan('jenis_tunjangan', this.title);
  }

  detail(e) {
    this.button_title = 'Update';
    console.log(this.button_title);
    this.open_form_add = true;
    this.builformtunjangan(e);
  }

}

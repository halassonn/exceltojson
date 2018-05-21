import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { ProfileModel } from '../../../../model/profile.model';
import { MatSnackBarVerticalPosition, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from '../../../../core/_http/loader/loader.service';
import { ProfileService } from '../../../../providers/profile.service';
import { MyCurrencyPipe } from '../../../../core/pipe/my-currency.pipe';
import { animate, style, transition, trigger } from '@angular/animations';
import { DataGajiModel } from '../../../../model/datagaji.model';
import { SettingService } from '../../../../providers/setting.service';
import { DataGajiService } from '../../../../providers/datagaji.service';
import { KolomTunjangan } from '../../../../model/kolomtunjangan.model';
import { ParameterJenisTunjanganKaryawan } from '../../../../model/parameterjenistunjangan.model';
import { FunctionUtils } from '../../../../core/utils/function';
import { ParameterBpjsModel } from '../../../../model/parameterbpjs.model';

@Component({
  selector: 'app-penggajian',
  templateUrl: './penggajian.component.html',
  styleUrls: ['./penggajian.component.scss'],
  animations: [
    trigger('dialog', [
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
export class PenggajianComponent implements OnInit {

  page = true;
  showmodal = false;
  updateData = false;
  showformadd = false;
  showmodaldelete = false;
  showcari = false;
  disable = true;
  btn_batal = false;
  disable_btn_KT: boolean;
  disable_btn_HR: boolean;
  select_menu: any;

  classmodal = 'cmodal2';
  classmodalcari = 'cmodal-cari';
  position_tooltip: any = 'after';
  mindate = new Date('1946-01-01T09:00:00');

  cari: any = '';
  title: any;




  kol: any = {
    'I': 'Kolom I => Karyawan (SMP/ex koperasi)',
    'II': 'Kolom II => Karyawan (SMU/baru)',
    'III': 'Kolom III => Karyawan (D3/baru)',
    'IV': 'Kolom IV => Karyawan (S1/baru)',
    'V': 'Kolom V => Kabag / Kasubag (SMU/D3/S1)',
    'Vp': 'Kolom V => Kabag (pusat) (SMU/D3/S1)',
    'Vc': 'Kolom V => Kasubag (cab) (SMU/D3/S1)',
    'VI': 'Kolom VI => Pimpinan Cab (SMU/D3/S1)',
    'VII': 'Kolom VII => Direktur (D3/S1/S2)',
    'VIII': 'Kolom VIII => Direktur Utama (D3/S1/S2)',
  };


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
  formgajitetap: FormGroup;

  carinik: number;
  persentjistri: any = 0;
  persentjanak: any = 0;
  persentjikesehatan: any = 0;
  persentht: any = 0;

  persenjp: any = 0;
  persenjketenagakerjaan: any = 0;
  persenbpjskesehatan: any = 0;

  persenjpp: any = 0;
  persenjketenagakerjaanp: any = 0;
  persenbpjskesehatanp: any = 0;

  persenjpk: any = 0;
  persenjketenagakerjaank: any = 0;
  persenbpjskesehatank: any = 0;


  gator: any = 0;
  potongan: any = 0;
  gaber: any = 0;

  @ViewChild('gapok')
  gapok: any;
  tjistri: any = 0;
  tjanak: any = 0;
  tjtht: any = 0;
  tjtransport: any = 0;
  tjpangan: any = 0;
  tjkhusus: any = 0;
  tjkesehatan: any = 0;
  tjjabatan: any = 0;
  tjperalihan: any = 0;
  tjpengabdian: any = 0;
  kolomtj: any = '';

  jp: any = 0;
  jketenagakerjaan: any = 0;
  bpjskesehatan: any = 0;
  pph21: any = 0;
  masakerja: any;
  showgaber = false;

  data_karyawan: ProfileModel = new ProfileModel();
  data_gaji: DataGajiModel = new DataGajiModel;
  parameterBpjss: ParameterBpjsModel[];
  kolom_tunjangans: KolomTunjangan[];
  kolom_tunjangan: KolomTunjangan = new KolomTunjangan();
  jenis_tunjangans: ParameterJenisTunjanganKaryawan[];
  jenis_tunjangan: ParameterJenisTunjanganKaryawan = new ParameterJenisTunjanganKaryawan;
  nik: any;



  constructor(
    private loaderservice: LoaderService,
    private profileService: ProfileService,
    private gajiservice: DataGajiService,
    private settingservice: SettingService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private mycurrencyPipe: MyCurrencyPipe,
    private functionutils: FunctionUtils,
    private renderer: Renderer) {

    this.getAllPersentaseBPJS();



  }

  getAllPersentaseBPJS() {
    this.settingservice.getAllParameterBpjs().subscribe(
      (res) => {
        if (res.statusCodeValue === 200) {
          this.parameterBpjss = res.body;
          this.persenjp = parseFloat(this.parameterBpjss.find((data) => data.title === 'Pensiun').persen);
          this.persenjketenagakerjaan = parseFloat(this.parameterBpjss.find((data) => data.title === 'Ketenagakerjaan').persen);
          this.persenbpjskesehatan = parseFloat(this.parameterBpjss.find((data) => data.title === 'BPJS Kesehatan').persen);

          this.persenjpp = parseFloat(this.parameterBpjss.find((data) => data.title === 'Pensiun').perusahaan);
          this.persenjketenagakerjaanp = parseFloat(this.parameterBpjss.find((data) => data.title === 'Ketenagakerjaan').perusahaan);
          this.persenbpjskesehatanp = parseFloat(this.parameterBpjss.find((data) => data.title === 'BPJS Kesehatan').perusahaan);

          this.persenjpk = parseFloat(this.parameterBpjss.find((data) => data.title === 'Pensiun').karyawan);
          this.persenjketenagakerjaank = parseFloat(this.parameterBpjss.find((data) => data.title === 'Ketenagakerjaan').karyawan);
          this.persenbpjskesehatank = parseFloat(this.parameterBpjss.find((data) => data.title === 'BPJS Kesehatan').karyawan);


        }
      }
    );
  }

  ngOnInit() {
    this.get_all_tunjangan();
    this.buildform(this.data_karyawan, this.data_gaji);
    console.log(this.data_karyawan.nik);
  }



  buildform(data?: ProfileModel, gaji?: DataGajiModel) {

    this.formgajitetap = this.fb.group(
      {

        'nik': [data.nik || '', Validators.required],
        'nama': [data.nama || '', Validators.required],
        'jabatan': [data.jabatan || '', Validators.required],
        'sts': [data.status || '', Validators.required],
        'pendidikan': [data.pendidikan || '', Validators.required],
        'gol': [data.gol || '', Validators.required],
        'masakerja': [data.masakerja || '', Validators.required],
        'gapok': [gaji.gapok || this.gapok, Validators.required],
        'gajihonor': [gaji.gajihonor || '0', Validators.required],
        'kolom': [gaji.kol || this.kolomtj, Validators.required],
        'tjistri': [gaji.tjistri || this.tjistri, Validators.required],
        'tjanak': [gaji.tjanak || this.tjanak, Validators.required],
        'tjjabatan': [gaji.tjjabatan || this.tjjabatan, Validators.required],
        'tjkesehatan': [gaji.tjkesehatan || this.tjkesehatan, Validators.required],
        'tjkhusus': [gaji.tjkhusus || this.tjkhusus, Validators.required],
        'tjtrans': [gaji.tjtransport || this.tjtransport, Validators.required],
        'tjprlihan': [gaji.tjperalihan || this.tjperalihan, Validators.required],
        'tjpangan': [gaji.tjpangan || this.tjpangan, Validators.required],
        'tjpengab': [gaji.tjpengabdian || this.tjpengabdian, Validators.required],
        'tht': [gaji.tht || this.tjtht, Validators.required],
        'jp': [this.jp],
        'bpjskesehatan': [this.bpjskesehatan],
        'jketenagakerjaan': [this.jketenagakerjaan],
        'pph21': [this.pph21]
      }
    );
  }


  select_kol(v) {
    this.get_all_tunjangan();
    console.log(v);
    this.kolomtj = v;
    this.kolom_tunjangans = this.kolom_tunjangans.filter(data => data.kolom === v);
    this.tjpangan = '0';
    this.tjtransport = '0';
    this.tjkhusus = '0';
    this.get_val_tunjangan('Ttrans');
    this.get_val_tunjangan('Tpang');
    this.get_val_tunjangan('Tkhs');
    this.get_val_tunjangan();

    //this.total_gaji();


  }

  act_tjperalihan(e) {
    this.tjperalihan = e;
    // this.total_gaji();
  }
  act_tjpengabidan(e) {
    this.tjpengabdian = e;
    // this.total_gaji();
  }


  proses_gaji() {
    this.loaderservice.status('Hitung Gaji....');
    this.loaderservice.loaderOpen();
    this.gator = '0';
    this.gaber = '0';
    this.potongan = '0';
    this.jp = '0';
    this.jketenagakerjaan = '0';
    this.bpjskesehatan = '0';
  
    setTimeout(() => {

      this.getAllPersentaseBPJS();

      this.gator = this.mycurrencyPipe.transform((
        Number(this.mycurrencyPipe.parse(this.gapok)) +
        Number(this.mycurrencyPipe.parse(this.tjanak)) +
        Number(this.mycurrencyPipe.parse(this.tjistri)) +
        Number(this.mycurrencyPipe.parse(this.tjjabatan)) +
        Number(this.mycurrencyPipe.parse(this.tjkesehatan)) +
        Number(this.mycurrencyPipe.parse(this.tjkhusus)) +
        Number(this.mycurrencyPipe.parse(this.tjpengabdian)) +
        Number(this.mycurrencyPipe.parse(this.tjperalihan)) +
        Number(this.mycurrencyPipe.parse(this.tjpangan)) +
        Number(this.mycurrencyPipe.parse(this.tjtransport)) +
        Number(this.mycurrencyPipe.parse(this.tjtht))).toLocaleString());

      const jp = ((this.persenjp * parseFloat(this.mycurrencyPipe.parse(this.gator))) / 100);
      const jktr = ((this.persenjketenagakerjaan * parseFloat(this.mycurrencyPipe.parse(this.gator))) / 100);
      const jbpjs = ((this.persenbpjskesehatan * parseFloat(this.mycurrencyPipe.parse(this.gator))) / 100);



      const jpk = ((this.persenjpk * parseFloat(this.mycurrencyPipe.parse(this.gator))) / 100);
      const jktrk = ((this.persenjketenagakerjaank * parseFloat(this.mycurrencyPipe.parse(this.gator))) / 100);
      const jbpjsk = ((this.persenbpjskesehatank * parseFloat(this.mycurrencyPipe.parse(this.gator))) / 100);
      const pt = jpk + jktrk + jbpjsk + parseFloat(this.mycurrencyPipe.parse(this.tjtht));

      this.jp = this.mycurrencyPipe.transform(jpk.toString());
      this.jketenagakerjaan = this.mycurrencyPipe.transform(jktrk.toString());
      this.bpjskesehatan = this.mycurrencyPipe.transform(jbpjsk.toString());

      this.potongan = this.mycurrencyPipe.transform(pt.toString());

      this.gaber = this.mycurrencyPipe.transform((
        Number(this.mycurrencyPipe.parse(this.gator)) -
        Number(this.mycurrencyPipe.parse(this.potongan))).toLocaleString());

      this.loaderservice.loaderclose();
    }, 2000); 

  }

  get_val_tunjangan_by_status(p: string) {
    if (this.kolom_tunjangans !== null) {
      this.kolom_tunjangan = this.kolom_tunjangans.find(data => data.status === p);
      console.log(this.kolom_tunjangan);
      // this.kolom_tunjangan ? this.persentjikesehatan = this.kolom_tunjangan.persen : this.persentjikesehatan = '0';
      if (this.kolom_tunjangan) {
        this.persentjikesehatan = this.kolom_tunjangan.persen;
      }
    } else {
      this.snackbar.open('Kolom tunjangan belum di setting', '', this.snackBarErrorConf);
    }
  }



  get_val_tunjangan(p?: string) {

    if (this.kolom_tunjangans !== null || this.kolom_tunjangans.length !== 0) {
      this.kolom_tunjangan = this.kolom_tunjangans.find(data => data.jenisTunjangan.kode === p);
      if (this.kolom_tunjangan) {
        console.log(this.kolom_tunjangan);
        switch (p) {
          case 'Ttrans':
            this.tjtransport = this.kolom_tunjangan.nominal || '0';
            console.log(this.tjtransport);
            break;
          case 'Tpang':
            this.tjpangan = this.kolom_tunjangan.nominal || '0';
            console.log(this.tjpangan);
            break;
          case 'Tkhs':
            this.tjkhusus = this.kolom_tunjangan.nominal || '0';
            console.log(this.tjkhusus);
            break;
          case 'THT':
            this.persentht = this.kolom_tunjangan.persen || '0';
            console.log('THT', this.persentht);
            break;
          case 'Tis':
            if (!this.data_karyawan.status.match('TK')) {
              this.persentjistri = this.kolom_tunjangan.persen;
              console.log('tj istri = ', this.persentjistri);
            }
            break;
          case 'Tank':

            if (!this.data_karyawan.status.match('TK') && !this.data_karyawan.status.match('K0')) {
              this.persentjanak = this.kolom_tunjangan.persen;
              console.log('tj anak = ', this.persentjanak);
            }
            break;
        }
      }
    } else {
      this.tjpangan = '0';
      this.tjtransport = '0';
      this.tjkhusus = '0';
      console.log('trans', this.tjtransport);
      console.log('pangan', this.tjpangan);
      console.log('khusus', this.tjkhusus);
    }
    this.buildform(this.data_karyawan, this.data_gaji);
  }

  get_all_tunjangan() {

    this.gajiservice.getAllDataTunjanganKaryawan().subscribe(
      (res) => {
        // console.log(res.body);
        this.kolom_tunjangans = res.body;
        if (this.kolom_tunjangans !== null) {
          this.kolom_tunjangans.map((data) => {
            this.kolom_tunjangan = data;
          });
        } else {
          this.kolom_tunjangan = new KolomTunjangan;
          this.snackbar.open('Kolom tunjangan belum di setting', '', this.snackBarErrorConf);
        }
      });
  }

  close() {
    this.showformadd = false;
    this.clear_var();
  }

  caridatakaryawan(nik) {
    this.loaderservice.status('Get Data.......');
    this.profileService.getDataKaryawan(nik).subscribe(
      (data) => {
        if (data === 'NOT_FOUND') {
          this.snackbar.open('Data Tidak Ditemukan', '', this.snackBarErrorConf);
        } else {
          console.log(data);
          this.data_karyawan = data;
          this.nik = this.data_karyawan.nik;
          this.gapok.nativeElement.focus();
          this.gapok = '';
          console.log(this.data_karyawan.status);
          this.get_val_tunjangan('Tis');
          this.get_val_tunjangan('Tank');
          this.get_val_tunjangan_by_status(this.data_karyawan.status);
          this.get_val_tunjangan('THT');
          this.buildform(this.data_karyawan, this.data_gaji);
          this.carinik = null;
          this.btn_batal = true;



        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  openFormGaji() {
    this.showformadd = !this.showformadd;
    this.select_menu = 'KT';
    this.title = 'Karyawan Tetap';
    this.disable_btn_KT = true;
    this.disable_btn_HR = false;
  }
  opencari() {
    this.cari = '';
    this.showcari = !this.showcari;

  }
  clear_var() {
    this.persentjistri = 0;
    this.persentjanak = 0;
    this.persentjikesehatan = 0;
    this.persentht = 0;

    this.gator = 0;
    this.gaber = 0;

    this.gapok = 0;
    this.tjistri = 0;
    this.tjanak = 0;
    this.tjtht = 0;
    this.tjtransport = 0;
    this.tjpangan = 0;
    this.tjkhusus = 0;
    this.tjkesehatan = 0;
    this.tjjabatan = 0;
    this.tjperalihan = 0;
    this.tjpengabdian = 0;
    this.kolomtj = '';
    this.btn_batal = false;
    this.data_karyawan = new ProfileModel;
    this.data_gaji = new DataGajiModel;
    this.buildform(this.data_karyawan, this.data_gaji);
  }

  batal() {
    this.clear_var();
  }
  stringTonumber(x: string) {
    return this.mycurrencyPipe.parse(x);
  }

  hitgaji(x?) {
    // console.log(this.stringTonumber(x));
    const gp = x;
    const tji = (this.persentjistri * gp) / 100;
    const tja = ((this.persentjanak * gp) / 100) * 3;
    const tjks = ((this.persentjikesehatan * gp) / 100);
    const tht = ((this.persentht * gp) / 100);


    this.gapok = this.mycurrencyPipe.transform(gp);
    this.tjistri = this.mycurrencyPipe.transform(tji.toLocaleString());
    this.tjanak = this.mycurrencyPipe.transform(tja.toLocaleString());
    this.tjkesehatan = this.mycurrencyPipe.transform(tjks.toLocaleString());
    this.tjtht = this.mycurrencyPipe.transform(tht.toLocaleString());

    console.log('x', this.persentht);
    console.log('x', tht);
    console.log('x', this.tjtht);




  }
}

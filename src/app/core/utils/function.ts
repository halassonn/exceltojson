import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";

@Injectable()
export class FunctionUtils {
    constructor(private datePipe: DatePipe) {

    }
    getMasakerja(tglmasuk: any): any {
        const tgl1: any = this.datePipe.transform(tglmasuk, 'dd-MM-yyyy');
        const tgl2: any = this.datePipe.transform(new Date(), 'dd-MM-yyyy');

         console.log('tgl1 ' + tgl1);
         console.log('tgl2 ' + tgl2);
        const parts1 = tgl1.split('-');
        const date1: any = new Date(parseInt(parts1[2], 10),     // year

            parseInt(parts1[1], 10) - 1, // month, starts with 0

            parseInt(parts1[0], 10));    // day
        // console.log('date1 ' + date1);


        const parts2 = tgl2.split('-');

        const date2: any = new Date(parseInt(parts2[2], 10),     // year

            parseInt(parts2[1], 10) - 1, // month, starts with 0

            parseInt(parts2[0], 10));    // day
        // console.log('date2 ' + date2);

        let yeardiff = 0;

        let monthdiff = 0;

        let daydiff = 0;

        let weekdiff = 0;

        yeardiff = parseInt(parts2[2], 10) - parseInt(parts1[2], 10);
        // console.log('yeardiff ' + yeardiff);

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
             //   console.log('daydiff ' + daydiff);
            } else {

                monthdiff--;

                const diff: any = new Date(date2 - date1);
                // tslint:disable-next-line:no-shadowed-variable
                const daydiff = diff / 1000 / 60 / 60 / 24;
               // console.log('daydiff ' + daydiff);
            }

        } else {

            daydiff = parseInt(parts2[0], 10) - parseInt(parts1[0], 10);
           // console.log('daydiff ' + daydiff);
        }
        if (daydiff >= 7) {

            weekdiff = Math.floor(daydiff / 7);

            daydiff = daydiff % 7;
          //  console.log('daydiff ' + daydiff);
        }

        const tahun = yeardiff;
        const bulan = monthdiff;
        const hari = daydiff;
        const weekly = weekdiff;

        const ms = {
            masakerjabl: '',
            masakerjath: ''
        }




        console.log(hari + ' Hari ' + weekly + ' Minggu ' + bulan + ' Bulan ' + tahun + ' tahun ');

        ms.masakerjath = this.numFunction(tahun);
        if (bulan < 0) {
            ms.masakerjabl = '';
            ms.masakerjath = '';
        } else {


            if (bulan >= 12) {
               // console.log('BULAN ' + bulan % 12);
                ms.masakerjabl = this.numFunction(bulan % 12) ;

            } else if (bulan < 12 && tahun > 0) {
                ms.masakerjath = this.numFunction(tahun - 1);
                ms.masakerjabl = this.numFunction(bulan);
            } else {
                ms.masakerjath = this.numFunction(tahun);
                ms.masakerjabl = this.numFunction(bulan);
            }

        }

        return ms;

    }


    numFunction(n: any): any {
        let num: any = parseInt(n, 10);
        if (isNaN(num)) {
            return n;
        }
        console.log(num + 'lenght ' + num.toFixed().length);
        if (num.toFixed().length > 0 && num.toFixed().length < 2) {
            num = '0' + num;
        }
        return num;
    }

}

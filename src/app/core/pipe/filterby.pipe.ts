import { PipeTransform, Pipe } from '@angular/core';
const PADDING = '000000';

@Pipe({
    name: 'filterBy'
})


export class FilterByPipe implements PipeTransform {

    private PREFIX: string;
    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;
    private SUFFIX: string;

    constructor() {
        this.PREFIX = '';
        this.DECIMAL_SEPARATOR = '.';
        this.THOUSANDS_SEPARATOR = ',';
        this.SUFFIX = ' Rp';
    }

    transform(items: any, value: string, value2: string, fractionSize: number = 0) {




        var i = items.length;
        var total = 0;

        // tslint:disable-next-line:curly
        while (i--)
            total += items[i][value2];

        // format to currency

        /*if (total > 0) {
            let [integer, fraction = ''] = (total || '').toString()
                .split('.');

            fraction = fractionSize > 0
                ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
                : '';

            integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

            //return total.toString();

            return this.PREFIX + integer + fraction;
        } */
        return total;




    }
    /*:any{ if (!items) {
         return [];
     }
     if (!field || !value) {
         return items;
     }
     var d = items.filter(singleItem => singleItem[field].toLowerCase().includes(value.toLowerCase().includes(value2.toLowerCase()));

     var i = d.length;
     var total = 0;

     while (i--) {
         total += 2;
         return total;
     }
     

 }*/


}

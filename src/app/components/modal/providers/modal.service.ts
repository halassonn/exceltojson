import {Injectable, Output, EventEmitter, Input} from '@angular/core';

@Injectable()
export class ModalService {
  @Output() loaderclass: EventEmitter<any> = new EventEmitter();
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() judul: string;
  @Output() conf: any;

  constructor() {}


    // event emitter

  public modalOpen(): any {
      return this.loaderclass.emit('page-container');
    }
  public modalclose(): any {
      return this.loaderclass.emit('page-container-full');
    }

    public setConf(classbody?: string, maxwidth?: number) {
    this.conf = {'class': classbody, 'maxWidth': maxwidth};
    }

    public setTitle(open: boolean, title?: string) {
      console.log(open);
      if (open === true) {
        this.judul = title;
      } else {
        this.judul = '';
      }
}

public getConf() {
  return this.conf;
}
    getTitle() {
      return this.judul;
    }

}

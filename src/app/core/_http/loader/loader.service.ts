import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable()
export class LoaderService {

  @Output() loaderclass: EventEmitter<any> = new EventEmitter();
  @Output()
  textstatus: EventEmitter<any> = new EventEmitter();
  constructor() {}


  public loaderOpen(): any {
    return this.loaderclass.emit('overlayOn');
  }
  public loaderclose(): any {
    return this.loaderclass.emit('overlayOff');
  }

  getEmittedValue() {
    return this.loaderclass;
  }
  getEmitStatusValue() {
    return this.textstatus;
  }

  public status(x: any): any {
    return this.textstatus.emit(x);
  }
}

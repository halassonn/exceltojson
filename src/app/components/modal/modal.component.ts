import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, OnDestroy} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import { ModalService } from './providers/modal.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({transform: 'scale3d(.3, .3, .3)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'scale3d(.0, .0, .0)'}))
      ])
    ])
  ]
})
export class ModalComponent implements OnChanges {
  @Input() showModal: boolean;
  @Input() mclass: string = 'cmodal' || '';
  @Input() judul: string;
  @Input() conf: any;

  constructor(private modalS: ModalService) {
    this.conf = this.modalS.getConf();
  }
    ngOnChanges(changes: SimpleChanges): void {
      this.judul = this.modalS.getTitle();
    }
    close() {
      this.showModal = false;
    }
}

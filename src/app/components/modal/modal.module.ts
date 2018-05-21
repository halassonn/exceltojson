import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ModalService } from './providers/modal.service';


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ModalComponent
    ],
    exports: [
        ModalComponent,

    ],
    providers: [ModalService]
})
export class ModalModule { }

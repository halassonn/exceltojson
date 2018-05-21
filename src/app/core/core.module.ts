import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LoaderComponent } from './_http/loader/loader.component';
import { LoaderService } from './_http/loader/loader.service';
import { HttpService } from './_http/http.service';
import { httpServiceFactory } from './_http/http-service.factory';
import { XHRBackend, RequestOptions, HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalModule } from '../components/modal/modal.module';
import { MyMaterialModule } from './materialmodule/material.module';


import { MyCurrencyPipe } from './pipe/my-currency.pipe';
import { MatPaginator, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DateFormat, APP_DATE_FORMATS } from './utils/date-formats';
import { MyCurrencyFormatterDirective } from '../directives/my-currency.directive';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
import { ImageUploadComponent } from './_imageUploader/_imageUploader.component';
import { FileDropDirective } from './_imageUploader/core/file-drop.directive';
import { ImageService } from './_imageUploader/core/image.service';
import { FunctionUtils } from './utils/function';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    MyMaterialModule,
    Angular2FontawesomeModule
  ],
  declarations: [LoaderComponent, MyCurrencyFormatterDirective, ImageUploadComponent, FileDropDirective],
  exports: [
    LoaderComponent,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    MyMaterialModule,
    HttpModule,
    MyCurrencyFormatterDirective,
    Angular2FontawesomeModule,
    ImageUploadComponent, FileDropDirective
  ],
  providers: [
    LoaderService,
    {
      provide: HttpService,
      useFactory: httpServiceFactory,
      deps: [XHRBackend, RequestOptions, LoaderService]
    },
    MatPaginator,
    { provide: DateAdapter, useClass: DateFormat },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }, DatePipe, ImageService, FunctionUtils
  ]
})
export class CoreModule { }

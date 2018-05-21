import { Component, OnInit } from '@angular/core';
import {LoaderService} from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  overlay_class = 'overlayOff';
  textstatus  = '...';
  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.getEmittedValue().subscribe((data) => {
      this.overlay_class = data;
    })
    this.loaderService.getEmitStatusValue().subscribe((data) => {
      this.textstatus = data;
    });
  }

}

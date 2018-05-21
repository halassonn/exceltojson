import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { ElectronService } from '../../../../providers/electron.service';




class Person {
  id: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private http: Http, private electronservice: ElectronService) { }

  ngOnInit() {

  }
  private extractData(res: Response) {
    const body = res.json();
    return body.data || {};
  }

  doPrint() {
    let printContents;
    printContents = document.getElementById('data').innerHTML;
    this.electronservice.ipcRenderer.send('print', printContents);
  }

}

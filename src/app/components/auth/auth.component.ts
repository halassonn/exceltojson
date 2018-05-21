import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBarVerticalPosition, MatSnackBarConfig, MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { LoaderService } from '../../core/_http/loader/loader.service';
import { AuthService } from '../../providers/auth.service';

export class AuthModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  authmodel: AuthModel = new AuthModel();
  formLogin: FormGroup;
  message: any;

  matSnackBarVerticalPosition: MatSnackBarVerticalPosition = 'top';
  matSnackBarHorizontalPosition: MatSnackBarHorizontalPosition = 'right';

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
  pageclass = 'cmodal';
  constructor(
    private _authservices: AuthService,
    private _loadservice: LoaderService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
    this.clear_storage();
    this.buildform();
  }

  clear_storage() {
    localStorage.clear();
  }
  buildform() {
    this.formLogin = this.fb.group({
      'username': [this.authmodel.username, Validators.required],
      'password': [this.authmodel.password, Validators.required],
    });
  }

  async doLogin2(e) {
    this.router.navigateByUrl('/layout');

  }
  async doLogin(event) {
    this.authmodel = event;
    this._loadservice.status('Login ........');

    this._authservices.on_login(this.authmodel.username, this.authmodel.password).subscribe(
      (issuccess) => {
        console.log(issuccess);
        // get userdetail
        this.router.navigateByUrl('/layout');

      }, (isError) => {

        console.error(isError)
        if (isError === 'Bad credentials') {
          this.message = 'Password Or Username Invalid...';
        } else {
          this.message = isError;
        }
        this.snackBar.open(this.message, '', this.snackBarErrorConf);
      }
    );

  }

}



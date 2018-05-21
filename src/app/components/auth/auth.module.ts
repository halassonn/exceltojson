import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { AuthService } from '../../providers/auth.service';


const routes: Routes = [
    {
        path: '', component: AuthComponent
    }
];
@NgModule({
    imports : [
        CommonModule,
        RouterModule.forChild(routes),
        CoreModule
    ],
    declarations : [
        AuthComponent
    ],
    exports : [
        AuthComponent,
        RouterModule
    ],
    providers : [
        AuthService
    ]
})
export class AuthModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { LayoutService } from './layout.service';
import { HomeComponent } from './page/home/home.component';
import { DatakantorComponent } from './page/datakantor/datakantor.component';
import { PenggajianComponent } from './page/penggajian/penggajian.component';
import { SettingsComponent } from './page/settings/settings.component';
import { UsersComponent } from './page/users/users.component';
import { DatakantorService } from '../../providers/datakantor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KaryawanComponent } from './page/karyawan/karyawan.component';
import { ProfileService } from '../../providers/profile.service';
import { DataGajiService } from '../../providers/datagaji.service';
import { MyCurrencyPipe } from '../../core/pipe/my-currency.pipe';
import { SettingService } from '../../providers/setting.service';
import { AuthService } from '../../providers/auth.service';


const routes: Routes = [
    {
        path : '', component: LayoutComponent,
        children : [
            {
                path : 'home', component: HomeComponent
            },
            {
                path: 'datakantor', component : DatakantorComponent
            },
            {
                path: 'penggajian', component : PenggajianComponent
            },
            {
                path : 'karyawan', component : KaryawanComponent
            },
            {
                path : 'users', component : UsersComponent
            },
            {
                path: 'setting', component: SettingsComponent
            }

        ]
    }
];

@NgModule({
imports: [
CommonModule,
RouterModule.forChild(routes),
CoreModule,
],
declarations : [
    LayoutComponent,
    HomeComponent,
    DatakantorComponent,
    PenggajianComponent,
    SettingsComponent,
    UsersComponent,
    KaryawanComponent
],
exports: [
    RouterModule,
    CoreModule,
    LayoutComponent,
    HomeComponent,
    DatakantorComponent,
    PenggajianComponent,
    SettingsComponent,
    UsersComponent,
    KaryawanComponent

],
providers : [
    LayoutService, DatakantorService, ProfileService, DataGajiService, MyCurrencyPipe, SettingService, AuthService]
})

export class LayoutModule {}

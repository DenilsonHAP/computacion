import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { AdminRoutes } from './admin.routing';

// ui components
import { AppPersonaListComponent } from './persona/list/persona-list.component';
import { AppPersonaDataComponent } from './persona/data/persona-data.component';
import { AppColegioListComponent } from './colegio/list/colegio-list.component';
import { AppColegioDataComponent } from './colegio/data/colegio-data.component';
import { AppCertificadoListComponent } from './certificado/list/certificado-list.component';
import { AppCertificadoDataComponent } from './certificado/data/certificado-data.component';
import { AppMatriculaListComponent } from './matricula/list/matricula-list.component';
import { AppMatriculaDataComponent } from './matricula/data/matricula-data.component';
import { AppMatriculaNotaDataComponent } from './matricula/nota/nota-data.component';
import { AppMatriculaPagoDataComponent } from './matricula/pago/pago-data.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';

import {AppCertificadoDetalleDataComponent } from './certificado/detalle/detalle-data.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
    MaterialModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
  ],
  declarations: [
    AppPersonaListComponent,
    AppPersonaDataComponent,
    AppColegioListComponent,
    AppColegioDataComponent,
    AppCertificadoListComponent,
    AppCertificadoDataComponent,
    AppMatriculaListComponent,
    AppMatriculaDataComponent,
    AppMatriculaNotaDataComponent,
    AppMatriculaPagoDataComponent,
    AppCertificadoDetalleDataComponent,
    ConfirmDialogComponent,
  ],
})
export class AdmincomponentsModule {}

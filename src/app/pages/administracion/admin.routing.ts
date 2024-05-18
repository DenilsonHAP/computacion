import { Routes } from '@angular/router';


// pages
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
import {AppCertificadoDetalleDataComponent } from './certificado/detalle/detalle-data.component';

export const AdminRoutes: Routes = [
  {
    path: 'persona',
    children: [

      { path: 'create', component: AppPersonaDataComponent },
      { path: 'edit/:id', component: AppPersonaDataComponent },
      { path: 'list', component: AppPersonaListComponent },

      { path: '**', redirectTo: 'list' },
    ],
  },

  {
    path: 'colegio',
    children: [

      { path: 'create', component: AppColegioDataComponent },
      { path: 'edit/:id', component: AppColegioDataComponent },
      { path: 'list', component: AppColegioListComponent },

      { path: '**', redirectTo: 'list' },
    ],
  },


  {
    path: 'certificado',
    children: [

      { path: 'create', component: AppCertificadoDataComponent },
      { path: 'edit/:id', component: AppCertificadoDataComponent },
      { path: 'list', component: AppCertificadoListComponent },
      { path: ':id/detalle', component: AppCertificadoDetalleDataComponent },
      { path: '**', redirectTo: 'list' },
    ],
  },


  {
    path: 'matricula',
    children: [

      { path: 'create', component: AppMatriculaDataComponent },
      { path: 'edit/:id', component: AppMatriculaDataComponent },
      { path: 'list', component: AppMatriculaListComponent },

      { path: ':id/pagos', component: AppMatriculaPagoDataComponent },
      { path: ':id/notas', component: AppMatriculaNotaDataComponent },
      { path: '**', redirectTo: 'list' },
    ],
  },
];

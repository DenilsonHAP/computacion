import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Colegio } from 'src/interface/colegio.interface';
import { Persona } from 'src/interface/persona.interface';
import { ColegioService } from 'src/service/colegio.service';
import { PersonaService } from 'src/service/persona.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../components/confirm-dialog/confirm-dialog.component';
import { filter, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Certificado } from 'src/interface/certificado.interface';
import { CertificadoService } from 'src/service/certificado.service';
import { MatriculaService } from '../../../../../service/matricula.service';


@Component({
  selector: 'app-certificado-list',
  templateUrl: './certificado-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppCertificadoListComponent implements OnInit{

  dataSource : Certificado[]=[];
  displayedColumns: string[] = ['nombre', 'detalle','accion'];




  constructor(private snackbar: MatSnackBar,private certificadoService: CertificadoService,private router: Router,private dialog: MatDialog, private matriculaService: MatriculaService) {
  }
  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
if (isLoggedIn === 'true') {
  
} else {
  this.router.navigate(['/login', ]);
}
    this.certificadoService.getCertificados().subscribe(personas=> {
      this.dataSource=personas;
      console.log(personas);

    });

  }

  onDelete(id:string | null| undefined) {
    if ( !id ) throw Error('Colegio id is required');

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: id
    });

    this.matriculaService.getMatriculasByColumn("certificado",id).subscribe(valor=>{
      console.log(valor);

      if(valor && valor.length>0){
        dialogRef.afterClosed()

        .subscribe(() => {
          this.showSnackbar(`${ id } denegado! Tiene relaciones.`);

        });

      }else{
        dialogRef.afterClosed()
        .pipe(
          filter( (result: boolean) => result ),
          switchMap( () => this.certificadoService.deleteCertificadoById( id )),
          filter( (wasDeleted: boolean) => wasDeleted ),
        )
        .subscribe(() => {
          this.showSnackbar(`${ id } eliminado! Recargue la página por favor.`);
          window.location.reload();
        });
      }
      });
    if(id){

    }

  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}

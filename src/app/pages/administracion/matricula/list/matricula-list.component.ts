
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
import { Matricula } from 'src/interface/matricula.interface';
import { MatriculaService } from '../../../../../service/matricula.service';
import { CertificadoService } from 'src/service/certificado.service';
import { NotaService } from 'src/service/nota.service';
import { PagoService } from '../../../../../service/pago.service';

@Component({
  selector: 'app-matricula-list',
  templateUrl: './matricula-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppMatriculaListComponent implements OnInit{

  dataSource : Matricula[]=[];
  displayedColumns: string[] = ['persona', 'certificado', 'nota','monto','accion'];




  constructor(private snackbar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private matriculaService: MatriculaService,
    private notaService:  NotaService,
    private pagoService: PagoService,
    private personaService: PersonaService,
    private certificadoService: CertificadoService,
   ) {
  }
  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
if (isLoggedIn === 'true') {
  
} else {
  this.router.navigate(['/login', ]);
}
    this.matriculaService.getMatriculas().subscribe(personas=> {
      if(personas){

        personas.forEach(element => {
          this.personaService.getPersonaById(element.persona).subscribe(colegio=>element.nombrePersona=colegio?colegio.nombre:'');
          this.certificadoService.getCertificadoById(element.certificado).subscribe(colegio=>element.nombreCertificado=colegio?colegio.nombre:'');
        });
      }
      this.dataSource=personas;

    });

  }

  onDelete(id:string | null| undefined) {
    if ( !id ) throw Error('Persona id is required');

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: id
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result ),
        switchMap( () => this.matriculaService.deleteMatriculaById( id )),
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
        //this.notaService.deleteNotaById
        this.showSnackbar(`${ id } eliminado! Recargue la página por favor.`);
        window.location.reload();
      });
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}

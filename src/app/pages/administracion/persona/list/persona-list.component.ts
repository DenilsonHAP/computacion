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

@Component({
  selector: 'app-persona-list',
  templateUrl: './persona-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppPersonaListComponent implements OnInit{
 
  dataSource : Persona[]=[];
  displayedColumns: string[] = ['persona', 'colegio', 'correo','accion'];
  
  
  

  constructor(private snackbar: MatSnackBar,private router: Router,private dialog: MatDialog,private personaService: PersonaService,private colegioService: ColegioService) {
  }
  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
if (isLoggedIn === 'true') {
  
} else {
  this.router.navigate(['/login', ]);
}
    this.personaService.getPersonas().subscribe(personas=> {
      this.dataSource=personas;
      if(personas){

        personas.forEach(element => {
          this.colegioService.getColegioById(element.colegio).subscribe(colegio=>element.nombreColegio=colegio?colegio.nombre:'');
        });
      }
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
        switchMap( () => this.personaService.deletePersonaById( id )),
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
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

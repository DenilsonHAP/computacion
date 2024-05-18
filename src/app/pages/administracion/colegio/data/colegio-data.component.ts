import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Persona } from 'src/interface/persona.interface';
import { PersonaService } from 'src/service/persona.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Colegio } from 'src/interface/colegio.interface';
import { ColegioService } from 'src/service/colegio.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4  as uuidv4 } from 'uuid';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-colegio-data',
  templateUrl: './colegio-data.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppColegioDataComponent implements OnInit{

  data? : Colegio;

  id : string | null;


  public form = new FormGroup({
    id:        new FormControl<string>(''),
    nombre: new FormControl<string>(''),
    direccion: new FormControl<string>(''),

  });

  constructor(private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private colegioService: ColegioService, private activatedRoute: ActivatedRoute,
    private router: Router) {
  }
  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      
    } else {
      this.router.navigate(['/login', ]);
    }
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    if(this.id){
      this.colegioService.getColegioById( this.id ).subscribe( result =>{
        if ( !result ) return this.router.navigate([ 'administracion/colegio/list' ]);

        this.data = result;

        this.form.setValue({
          id: result.id,
          nombre: result.nombre,
          direccion: result.direccion,

        });


        console.log(result);

        return;
    });
    }

  }

  get current(): Colegio {
    const hero = this.form.value as Colegio;
    return hero;
  }
  get f() {
    return this.form.controls;
  }
  onSubmit():void {
    console.log(this.form.invalid);

    if ( this.form.invalid ) return;

    if ( this.id ) {
      this.current.id=this.id ;
      this.colegioService.updateColegio( this.current )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.nombre} updated!`);
          this.router.navigate(['/administracion/colegio/list']);
        });

      return;
    }
    this.current.id=uuidv4();

    this.colegioService.addColegio( this.current )
      .subscribe( hero => {
        // TODO: mostrar snackbar, y navegar a /heroes/edit/ hero.id

        this.showSnackbar(`${ hero.nombre } created!`);
        this.router.navigate(['/administracion/colegio/list', ]);
      });
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}

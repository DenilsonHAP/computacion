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

@Component({
  selector: 'app-persona-data',
  templateUrl: './persona-data.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppPersonaDataComponent implements OnInit{

  data? : Persona;
  colegios? : Colegio[]=[];
  id : string | null;
  valor : string ="1";

  public form = new FormGroup({
    id:        new FormControl<string>(''),
    nombre: new FormControl<string>(''),
    colegio: new FormControl<string>(''),
    correo: new FormControl<string>(''),
  });

  constructor(private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private personaService: PersonaService,private colegioService: ColegioService, private activatedRoute: ActivatedRoute,
    private router: Router) {
  }
  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
if (isLoggedIn === 'true') {
  
} else {
  this.router.navigate(['/login', ]);
}
    this.colegioService.getColegios().subscribe(colegios=>{
      this.colegios=colegios;
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    if(this.id){
      this.personaService.getPersonaById( this.id ).subscribe( result =>{
        if ( !result ) return this.router.navigate([ 'administracion/persona/list' ]);

        this.data = result;
        this.valor=result.colegio;
        this.form.setValue({
          id: result.id,
          nombre: result.nombre,
          colegio: result.colegio,
          correo: result.correo
        });

        console.log(result);

        return;
    });
    }

  }

  get current(): Persona {
    const hero = this.form.value as Persona;
    return hero;
  }
  get f() {
    return this.form.controls;
  }
  onSubmit():void {
    console.log(this.form);
    console.log(this.current);
    if ( this.form.invalid ) return;

    if ( this.id ) {
      this.current.id=this.id ;
      this.personaService.updatePersona( this.current )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.nombre} updated!`);
          this.router.navigate(['/administracion/persona/list']);
        });

      return;
    }
    this.current.id=uuidv4();

    this.personaService.addPersona( this.current )
      .subscribe( hero => {
        // TODO: mostrar snackbar, y navegar a /heroes/edit/ hero.id

        this.showSnackbar(`${ hero.nombre } created!`);
        this.router.navigate(['/administracion/persona/list', ]);
      });
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}

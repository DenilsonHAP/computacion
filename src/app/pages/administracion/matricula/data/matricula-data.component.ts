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
import { MatriculaService } from '../../../../../service/matricula.service';
import { CertificadoService } from '../../../../../service/certificado.service';
import { Matricula } from 'src/interface/matricula.interface';
import { Certificado } from 'src/interface/certificado.interface';
import { Nota } from 'src/interface/nota.interface';
import { NotaService } from '../../../../../service/nota.service';

@Component({
  selector: 'app-matricula-data',
  templateUrl: './matricula-data.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppMatriculaDataComponent implements OnInit{

  data? : Matricula;

  personas: Persona[]=[];
  certificados: Certificado[]=[];

  id : string | null;
  valorPersona : string ="1";
  valorCertificado : string ="1";

  public form = new FormGroup({
    id:        new FormControl<string>(''),
    persona: new FormControl<string>(''),
    certificado: new FormControl<string>(''),

  });

  constructor(private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private matriculaService: MatriculaService,
    private personaService: PersonaService,
    private certificadoService: CertificadoService,
    private activatedRoute: ActivatedRoute,

    private notaService: NotaService,
    private router: Router) {
  }
  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
if (isLoggedIn === 'true') {
  
} else {
  this.router.navigate(['/login', ]);
}
    this.personaService.getPersonas().subscribe(valor=> this.personas=valor);
    this.certificadoService.getCertificados().subscribe(valor=>this.certificados=valor);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    if(this.id){
      this.matriculaService.getMatriculaById( this.id ).subscribe( result =>{
        if ( !result ) return this.router.navigate([ 'administracion/matricula/list' ]);
        result.nombreCertificado
        this.valorCertificado=result.certificado;
        this.valorPersona=result.persona;

        this.form.patchValue({
          id: result.id,
          persona: result.persona,
          certificado: result.certificado
        });
        this.data = result;
        console.log(result);

        return;
    });
    }

  }

  get current(): Matricula {
    const hero = this.form.value as Matricula;
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
      this.current.nota=this.data?.nota;
      this.matriculaService.updateMatricula( this.current )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.certificado} - ${ hero.persona} updated!`);
          this.router.navigate(['/administracion/matricula/list']);
        });

      return;
    }
    this.current.id=uuidv4();

    this.matriculaService.addMatricula( this.current )
      .subscribe( hero => {
        this.certificadoService.getCertificadoById(hero.certificado).subscribe(valor=>{
          valor?.detalle?.forEach(element => {
            let idN=uuidv4();
            let nota : Nota ={id:idN,detalle:element.id,matricula:hero.id};
            this.notaService.addNota(nota).subscribe();
          });
        });
        this.showSnackbar(`${ hero.certificado} - ${ hero.persona}  created!`);
        this.router.navigate(['/administracion/matricula/list', ]);
      });
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}

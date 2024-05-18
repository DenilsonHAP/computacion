
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
import { Nota, NotaVO } from '../../../../../interface/nota.interface';
import { NotaService } from '../../../../../service/nota.service';

@Component({
  selector: 'app-nota-data',
  templateUrl: './nota-data.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppMatriculaNotaDataComponent implements OnInit{

  data? : Matricula;
  certificado? : Certificado;
  personas: Persona[]=[];
  certificados: Certificado[]=[];
  notas: Nota[]=[];
  notasVO: NotaVO[]=[];
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
    this.notaService.getNotasByColumn("matricula",this.id?this.id:"").subscribe(valor=>{this.notas=valor; console.log(valor);
    });
    if(this.id){
      this.matriculaService.getMatriculaById( this.id ).subscribe( result =>{
        if ( !result ) return this.router.navigate([ 'administracion/matricula/list' ]);
        result.nombreCertificado
        this.valorCertificado=result.certificado;
        this.valorPersona=result.persona;
        this.personaService.getPersonaById(result.persona).subscribe(valor=>result.nombrePersona=valor?.nombre);
        this.certificadoService.getCertificadoById(result.certificado).subscribe(valor=>{
          result.nombreCertificado=valor?.nombre; this.certificado=valor;
          
          valor?.detalle?.forEach(element => {
            this.notas.forEach(eNota => {
              if(eNota.detalle==element.id && eNota.matricula==this.id){
                let nVo: NotaVO = {
                  id:eNota.id,
                  descripcion: element.descripcion,
                  titulo: element.titulo,
                  detalle: element.id,
                  matricula: this.id ? this.id : '', // Si this.id es undefined o null, se asigna un valor vacío ''
                  nota:eNota.nota,
                  recomendacion:eNota.recomendacion
                };
                this.notasVO.push(nVo);
                console.log(nVo);
                
              }
            });
           
  
          });
        });
        console.log(this.notasVO);
        
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

  
  
  onSubmit():void {
    
    if ( this.id ) {
      let notaFinal : number=0;
      this.notas.forEach(element => {
        const inputs = document.querySelectorAll<HTMLInputElement>('[data-id]');
        inputs.forEach((input) => {
         
          
          const valor = input.value; // Obtener el valor del input
          const id = input.getAttribute('data-id'); // Obtener el valor del atributo data-id
          if(id==element.id+"-nota" ){
            if(valor){
              element.nota= parseInt(valor);
            }else{
              element.nota= 0;
            }
            notaFinal+=element.nota?element.nota:0;
          }else if(element.id+"-recomendacion"==id){
            element.recomendacion= valor;
          }
          
        
          
        });

        this.notaService.updateNota(element).subscribe();
        console.log(element);
        
      });
      console.log(notaFinal);
      console.log(this.notas);
      if(this.data){
        this.data.nota=notaFinal/this.notas.length;
        this.matriculaService.updateMatricula(this.data).subscribe();
      }
        this.showSnackbar(`${ this.data?.nombreCertificado} - ${ this.data?.nombrePersona} updated!`);
        this.router.navigate(['/administracion/matricula/list']);
      return;
    }
   
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}

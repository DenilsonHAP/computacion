import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { Persona } from 'src/interface/persona.interface';
import { PersonaService } from 'src/service/persona.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Colegio } from 'src/interface/colegio.interface';
import { ColegioService } from 'src/service/colegio.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4  as uuidv4 } from 'uuid';
import { CertificadoService } from '../../../../../service/certificado.service';
import { DetalleCertificado } from 'src/interface/certificado.interface';
import { Certificado } from 'src/interface/certificado.interface';

import { ConfirmDialogComponent } from 'src/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-detalle-data',
  templateUrl: './detalle-data.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppCertificadoDetalleDataComponent implements OnInit{

  public form = new FormGroup({
    id:        new FormControl<string>(''),
    titulo: new FormControl<string>(''),
    descripcion: new FormControl<string>(''),
   
  });
  data? : Certificado;
  //certificado? : Certificado;
  personas: Persona[]=[];
  certificados: Certificado[]=[];
  
  id : string | null;
  

  
  constructor(private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private personaService: PersonaService,
    private certificadoService: CertificadoService,
    private activatedRoute: ActivatedRoute,
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
      this.certificadoService.getCertificadoById( this.id ).subscribe( result =>{
        if ( !result ) return this.router.navigate([ 'administracion/certificado/list' ]);
       
       
        
        
        this.data = result;
        console.log(result);

        return;
    });
    }

  }

  get current(): DetalleCertificado {
    const hero = this.form.value as DetalleCertificado;
    return hero;
  }
  
  onSubmit():void {
    if ( this.form.invalid ) return;
    if ( this.id ) {
      let notaFinal : number=0;
      this.current.id=uuidv4();

      this.certificadoService.getCertificadoById(this.id).subscribe(valor=>{
        if(valor){
          if(valor.detalle){
            valor?.detalle?.push(this.current);
          }else{
            let nuevo:DetalleCertificado []=[];
            nuevo.push(this.current);
            valor.detalle=nuevo;
          }
          
          this.certificadoService.updateCertificado(valor).subscribe(valor=>{
            this.showSnackbar(`${ this.data?.nombre}  updated!`);
            this.router.navigate(['/administracion/certificado/list']);
        
          });
        }else{
          this.showSnackbar(`NOT FOUND!`);
          this.router.navigate(['/administracion/certificado/list']);
      
        }
        

      });
      
         
          
         
       
      
        return;
    }
   
  }

  onDelete(id:string | null| undefined) {
    if ( !id ) throw Error('Pago id is required');

    
    this.showSnackbar(`${ id } eliminado! Recargue la página por favor.`);
        let notaFinal : number=0;
        this.certificadoService.getCertificadoById(this.id?this.id:"").subscribe(valor=>{
          if(valor){
            let nuevo:DetalleCertificado []=[];
            valor.detalle?.forEach(element => {
              if(element.id!=id){
                nuevo.push(element);
              }
            });
            valor.detalle=nuevo;
            this.certificadoService.updateCertificado(valor).subscribe(valor=>{
              window.location.reload();
            });
          }else{
            this.showSnackbar(`NOT FOUND!`);
            this.router.navigate(['/administracion/certificado/list']);
       
          }
        });
  }
  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}

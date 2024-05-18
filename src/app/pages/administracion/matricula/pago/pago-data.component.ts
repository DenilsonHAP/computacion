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
import { MatriculaService } from '../../../../../service/matricula.service';
import { CertificadoService } from '../../../../../service/certificado.service';
import { Matricula } from 'src/interface/matricula.interface';
import { Certificado } from 'src/interface/certificado.interface';
import { Pago } from 'src/interface/pago.interface';
import { PagoService } from 'src/service/pago.service';
import { ConfirmDialogComponent } from 'src/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-pago-data',
  templateUrl: './pago-data.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppMatriculaPagoDataComponent implements OnInit{

  public form = new FormGroup({
    id:        new FormControl<string>(''),
    monto: new FormControl<number>(0),
    codigo: new FormControl<string>(''),
    matricula: new FormControl<string>(''),
  });
  data? : Matricula;
  certificado? : Certificado;
  personas: Persona[]=[];
  certificados: Certificado[]=[];
  pagos: Pago[]=[];
  
  id : string | null;
  valorPersona : string ="1";
  valorCertificado : string ="1";

  
  constructor(private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private matriculaService: MatriculaService,
    private personaService: PersonaService,
    private certificadoService: CertificadoService,
    private activatedRoute: ActivatedRoute,
    private pagoService: PagoService,
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
        this.personaService.getPersonaById(result.persona).subscribe(valor=>result.nombrePersona=valor?.nombre);
        this.certificadoService.getCertificadoById(result.certificado).subscribe(valor=>{
          result.nombreCertificado=valor?.nombre; this.certificado=valor;
          
          
        });
       
        this.pagoService.getPagosByColumn("matricula",this.id?this.id:"").subscribe(valor=>{
          this.pagos=valor;
        });
        
        this.data = result;
        console.log(result);

        return;
    });
    }

  }

  get current(): Pago {
    const hero = this.form.value as Pago;
    return hero;
  }
  
  onSubmit():void {
    if ( this.form.invalid ) return;
    if ( this.id ) {
      let notaFinal : number=0;
      this.current.id=uuidv4();

      this.current.matricula=this.id ;
      if (typeof this.current.monto === 'string') {
        this.current.monto=parseInt(this.current.monto);
      }
      this.pagoService.addPago(this.current).subscribe(newPago=>{
        if (typeof this.current.monto === 'string') {
          notaFinal+=parseInt(this.current.monto);
        }else{
          notaFinal+=this.current.monto;
        }
        
        this.pagoService.getPagosByColumn("matricula",this.id?this.id:"").subscribe(valor=>{
          valor.forEach(element => {
            if (typeof element.monto === 'string') {
              notaFinal+=parseInt(element.monto);
            }else{
              notaFinal+=element.monto;
            }
          
          });
           console.log(valor);
           if(this.data){
            this.data.monto=notaFinal-this.current.monto;
            this.matriculaService.updateMatricula(this.data).subscribe();
          }
            this.showSnackbar(`${ this.data?.nombreCertificado} - ${ this.data?.nombrePersona} updated!`);
            this.router.navigate(['/administracion/matricula/list']);
         });
         
         
         
       
      });
        return;
    }
   
  }

  onDelete(id:string | null| undefined) {
    if ( !id ) throw Error('Pago id is required');

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: id
    });
    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result ),
        switchMap( () => this.pagoService.deletePagoById( id )),
        filter( (wasDeleted: boolean) => wasDeleted ),
      )
      .subscribe(() => {
        this.showSnackbar(`${ id } eliminado! Recargue la página por favor.`);
        let notaFinal : number=0;
        this.pagoService.getPagosByColumn("matricula",this.id?this.id:"").subscribe(valor=>{
          valor.forEach(element => {
            if (typeof element.monto === 'string') {
              notaFinal+=parseInt(element.monto);
            }else{
              notaFinal+=element.monto;
            }
          
          });
           console.log(valor);
           if(this.data){
            this.data.monto=notaFinal;
            this.matriculaService.updateMatricula(this.data).subscribe();
          }
            this.showSnackbar(`${ this.data?.nombreCertificado} - ${ this.data?.nombrePersona} updated!`);
            this.router.navigate(['/administracion/matricula/list']);
         });
         
        window.location.reload();
      });
  }
  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}

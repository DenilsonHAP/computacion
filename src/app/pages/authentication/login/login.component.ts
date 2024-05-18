import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/interface/login.interface';
import { LoginService } from '../../../../service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent implements OnInit{
  public form = new FormGroup({
    id:        new FormControl<string>(''),
    usuario: new FormControl<string>(''),
    contrasena: new FormControl<string>(''),
  });
  constructor(private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router, private loginService:LoginService) {
  }
  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
if (isLoggedIn === 'true') {
  this.router.navigate(['/dashboard', ]);
} else {
  
}
  }

  get current(): Login {
    const hero = this.form.value as Login;
    return hero;
  }
  get f() {
    return this.form.controls;
  }
  onSubmit():void {
    console.log(this.form.invalid);

    if ( this.form.invalid ) return;

    this.loginService.getLoginsByColumn("usuario",this.current.usuario).subscribe(valor=>{
      valor.forEach(element => {
        if(element.contrasena==this.current.contrasena){
          localStorage.setItem('isLoggedIn', 'true');

          this.showSnackbar(`Logeado!!`);
          this.router.navigate(['/dashboard', ]);
        }
        
      });
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        
      } else {
        this.showSnackbar(`Credenciales incorrectas!!`);
      }
    });
    
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}

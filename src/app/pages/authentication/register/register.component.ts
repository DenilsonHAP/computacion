import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent implements OnInit{
  constructor(private router: Router,private snackbar: MatSnackBar) {}
  ngOnInit(): void {
    localStorage.setItem('isLoggedIn', 'false');

    this.showSnackbar(`Cerrando sesión!!`);
    this.router.navigate(['/login', ]);
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}

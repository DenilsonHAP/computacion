import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Login } from '../interface/login.interface';
import { environments } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class LoginService {

  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }

  getLoginsByColumn(columna: string , valor : string){
    return this.http.get<Login[]>(`${ this.baseUrl }/login?`+columna+'='+valor, {
      params: {
        columna: valor
      }
    });
  }
  getLogins():Observable<Login[]> {
    return this.http.get<Login[]>(`${ this.baseUrl }/login`);
  }

  getLoginById( id: string ): Observable<Login|undefined> {
    return this.http.get<Login>(`${ this.baseUrl }/login/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Login[]> {
    return this.http.get<Login[]>(`${ this.baseUrl }/login?q=${ query }&_limit=6`);
  }

  addLogin( Login: Login ): Observable<Login> {
    return this.http.post<Login>(`${ this.baseUrl }/login`, Login );
  }

  updateLogin( Login: Login ): Observable<Login> {
    if ( !Login.id ) throw Error('Login id is required');

    return this.http.patch<Login>(`${ this.baseUrl }/login/${ Login.id }`, Login );
  }

  deleteLoginById( id: string ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/login/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }


}

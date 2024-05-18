import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Matricula } from '../interface/matricula.interface';
import { environments } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class MatriculaService {

  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }

  getMatriculasByColumn(columna: string , valor : string){
    return this.http.get<Matricula[]>(`${ this.baseUrl }/matricula?`+columna+'='+valor, {
      params: {
        columna: valor
      }
    });
  }
  getMatriculas():Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${ this.baseUrl }/matricula`);
  }

  getMatriculaById( id: string ): Observable<Matricula|undefined> {
    return this.http.get<Matricula>(`${ this.baseUrl }/matricula/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${ this.baseUrl }/matricula?q=${ query }&_limit=6`);
  }

  addMatricula( Matricula: Matricula ): Observable<Matricula> {
    return this.http.post<Matricula>(`${ this.baseUrl }/matricula`, Matricula );
  }

  updateMatricula( Matricula: Matricula ): Observable<Matricula> {
    if ( !Matricula.id ) throw Error('Matricula id is required');

    return this.http.patch<Matricula>(`${ this.baseUrl }/matricula/${ Matricula.id }`, Matricula );
  }

  deleteMatriculaById( id: string ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/matricula/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }


}

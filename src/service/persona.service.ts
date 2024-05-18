import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Persona } from '../interface/persona.interface';
import { environments } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class PersonaService {

  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }

  getPersonasByColumn(columna: string , valor : string){
    return this.http.get<Persona[]>(`${ this.baseUrl }/persona?`+columna+'='+valor, {
      params: {
        columna: valor
      }
    });
  }
  getPersonas():Observable<Persona[]> {
    return this.http.get<Persona[]>(`${ this.baseUrl }/persona`);
  }

  getPersonaById( id: string ): Observable<Persona|undefined> {
    return this.http.get<Persona>(`${ this.baseUrl }/persona/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${ this.baseUrl }/persona?q=${ query }&_limit=6`);
  }

  addPersona( Persona: Persona ): Observable<Persona> {
    return this.http.post<Persona>(`${ this.baseUrl }/persona`, Persona );
  }

  updatePersona( Persona: Persona ): Observable<Persona> {
    if ( !Persona.id ) throw Error('Persona id is required');

    return this.http.patch<Persona>(`${ this.baseUrl }/persona/${ Persona.id }`, Persona );
  }

  deletePersonaById( id: string ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/persona/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }


}

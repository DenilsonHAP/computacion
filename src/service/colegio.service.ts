import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Colegio } from '../interface/colegio.interface';
import { environments } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class ColegioService {

  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }


  getColegios():Observable<Colegio[]> {
    return this.http.get<Colegio[]>(`${ this.baseUrl }/colegio`);
  }

  getColegioById( id: string ): Observable<Colegio|undefined> {
    return this.http.get<Colegio>(`${ this.baseUrl }/colegio/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Colegio[]> {
    return this.http.get<Colegio[]>(`${ this.baseUrl }/colegio?q=${ query }&_limit=6`);
  }

  addColegio( Colegio: Colegio ): Observable<Colegio> {
    return this.http.post<Colegio>(`${ this.baseUrl }/colegio`, Colegio );
  }

  updateColegio( Colegio: Colegio ): Observable<Colegio> {
    if ( !Colegio.id ) throw Error('Colegio id is required');

    return this.http.patch<Colegio>(`${ this.baseUrl }/colegio/${ Colegio.id }`, Colegio );
  }

  deleteColegioById( id: string ): Observable<boolean> {
    
    return this.http.delete(`${ this.baseUrl }/colegio/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }

}

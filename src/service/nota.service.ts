import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Nota } from '../interface/nota.interface';
import { environments } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class NotaService {

  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }

  getNotasByColumn(columna: string , valor : string){
    return this.http.get<Nota[]>(`${ this.baseUrl }/nota?`+columna+'='+valor, {
      params: {
        columna: valor
      }
    });
  }
  getNotasByTwoColumn(columna: string , valor : string,columna2: string , valor2 : string){
    return this.http.get<Nota[]>(`${ this.baseUrl }/nota?`+columna+'='+valor+"&"+columna2+'='+valor2, {
      params: {
        columna: valor,
        columna2:valor2
      }
    });
  }
  getNotas():Observable<Nota[]> {
    return this.http.get<Nota[]>(`${ this.baseUrl }/nota`);
  }

  getNotaById( id: string ): Observable<Nota|undefined> {
    return this.http.get<Nota>(`${ this.baseUrl }/nota/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Nota[]> {
    return this.http.get<Nota[]>(`${ this.baseUrl }/nota?q=${ query }&_limit=6`);
  }

  addNota( Nota: Nota ): Observable<Nota> {
    return this.http.post<Nota>(`${ this.baseUrl }/nota`, Nota );
  }

  updateNota( Nota: Nota ): Observable<Nota> {
    if ( !Nota.id ) throw Error('Nota id is required');

    return this.http.patch<Nota>(`${ this.baseUrl }/nota/${ Nota.id }`, Nota );
  }

  deleteNotaById( id: string ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/nota/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }


}

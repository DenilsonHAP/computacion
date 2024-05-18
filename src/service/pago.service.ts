import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Pago } from '../interface/pago.interface';
import { environments } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class PagoService {

  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }

  getPagosByColumn(columna: string , valor : string){
    return this.http.get<Pago[]>(`${ this.baseUrl }/pago?`+columna+'='+valor, {
      params: {
        columna: valor
      }
    });
  }
  getPagosByTwoColumn(columna: string , valor : string,columna2: string , valor2 : string){
    return this.http.get<Pago[]>(`${ this.baseUrl }/pago?`+columna+'='+valor+"&"+columna2+'='+valor2, {
      params: {
        columna: valor,
        columna2:valor2
      }
    });
  }
  getPagos():Observable<Pago[]> {
    return this.http.get<Pago[]>(`${ this.baseUrl }/pago`);
  }

  getPagoById( id: string ): Observable<Pago|undefined> {
    return this.http.get<Pago>(`${ this.baseUrl }/pago/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${ this.baseUrl }/pago?q=${ query }&_limit=6`);
  }

  addPago( Pago: Pago ): Observable<Pago> {
    return this.http.post<Pago>(`${ this.baseUrl }/pago`, Pago );
  }

  updatePago( Pago: Pago ): Observable<Pago> {
    if ( !Pago.id ) throw Error('Pago id is required');

    return this.http.patch<Pago>(`${ this.baseUrl }/pago/${ Pago.id }`, Pago );
  }

  deletePagoById( id: string ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/pago/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }


}

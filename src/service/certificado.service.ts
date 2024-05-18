import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Certificado } from '../interface/certificado.interface';
import { environments } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class CertificadoService {

  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }

  getCertificadosByColumn(columna: string , valor : string){
    return this.http.get<Certificado[]>(`${ this.baseUrl }/certificado?`+columna+'='+valor, {
      params: {
        columna: valor
      }
    });
  }
  getCertificados():Observable<Certificado[]> {
    return this.http.get<Certificado[]>(`${ this.baseUrl }/certificado`);
  }

  getCertificadoById( id: string ): Observable<Certificado|undefined> {
    return this.http.get<Certificado>(`${ this.baseUrl }/certificado/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(`${ this.baseUrl }/certificado?q=${ query }&_limit=6`);
  }

  addCertificado( Certificado: Certificado ): Observable<Certificado> {
    return this.http.post<Certificado>(`${ this.baseUrl }/certificado`, Certificado );
  }

  updateCertificado( Certificado: Certificado ): Observable<Certificado> {
    if ( !Certificado.id ) throw Error('Certificado id is required');

    return this.http.patch<Certificado>(`${ this.baseUrl }/certificado/${ Certificado.id }`, Certificado );
  }

  deleteCertificadoById( id: string ): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/certificado/${ id }`)
      .pipe(
        map( resp => true ),
        catchError( err => of(false) ),
      );
  }


}

import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../interfaces/auth.interface';
import { tap, Observable, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _auth: Auth | undefined;
  constructor(private http: HttpClient) { }

  get auth(){ // creo un getter para poder acceder al usuario desde otro componente ya que los servicios son globables
    return {...this._auth}; //lo desestructuro para evitar el riesgo de cambiar el objeto por error
  }

  verificaAutenticacion(): Observable<boolean>{
    if(!localStorage.getItem('token')){
      return of(false);
    }else{

      return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
      .pipe(
       map(auth => {
        console.log('map',auth);
        return true;
       })
      );

    }
  }

  login(){
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
      .pipe(
        tap(auth => this._auth = auth), // con tap puedo hacer algo con el valor antes de retornar el observable
        tap(auth => localStorage.setItem('token',auth.id))
      );
  }
}

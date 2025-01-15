import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs';
import { Usuario } from 'src/app/login/usuario';

@Injectable({
  providedIn: 'root',
})
export class LoginsService {
  token = sessionStorage.getItem('token');
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    }),
  };
  private urlusuario: string =
    'https://app-practicas.onrender.com/api/auth/usuario/validar';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}
  validarUsuario(user: String, pass: String): Observable<Usuario[]> {
    console.log({ usuario: user, password: pass });
    return this.http.post<Usuario[]>(this.urlusuario, {
      usuario: user,
      password: pass,
    });
  }

  get isLogged() {
    return (
      sessionStorage.getItem('TOKEN') && sessionStorage.getItem('EXPIRE_IN')
    );
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);

    sessionStorage.setItem('id', payload.user.id);
    sessionStorage.setItem('rol', payload.user.idrol);
    sessionStorage.setItem('nombre', payload.user.nombrecompleto);
    sessionStorage.setItem('dni', payload.user.dni);
  }
  guardarToken(accessToken: string): void {
    sessionStorage.setItem('token', accessToken);
    this.cookieService.set('token_access', accessToken, 4, '/');
  }

  eliminarToken() {
    sessionStorage.clear();
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      if (accessToken.length > 0) {
        return JSON.parse(atob(accessToken.split('.')[1]));
      }
    }
    return null;
  }

  login(user: String, pass: String): Observable<any> {
    const urlEndpoint =
      'https://app-back-practicas.onrender.com/api/auth/';

    return this.http.post<any>(urlEndpoint, { username: user, password: pass });
  }
}

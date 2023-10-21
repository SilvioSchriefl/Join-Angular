import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  token!: string
  

  constructor(
    private router: Router,
    public auth: AuthService,
    ) { }

  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    let token_local = localStorage.getItem('token');
    if(this.auth.token) this.token = this.auth.token;
    if(token_local) this.token = token_local
    if (this.token) {
      request = request.clone({
        setHeaders: { Authorization: `Token ${this.token}` }
      });
    }

    return next.handle(request).pipe(catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigateByUrl('/login');
        }
      }
      return throwError(() => err);
    }));
  }
}

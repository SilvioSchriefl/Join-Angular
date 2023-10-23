import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  
  

  constructor(
    private router: Router,
    public auth: AuthService,
    ) { }

  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = ''
    let token_local = localStorage.getItem('token');
    console.log(token_local);
    if(this.auth.token) token = this.auth.token;
    if(token_local) token = token_local
    if (token.length > 0) {	
      console.log(token, this.auth.token);
      request = request.clone({
        setHeaders: { Authorization: `Token ${token}` }
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

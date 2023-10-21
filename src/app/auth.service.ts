import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from './enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token!: string
  remember_me!: boolean
  user:any
  request_error: boolean = false
  request_successful: boolean = false

  constructor(private http: HttpClient) { }


  async loginWithEmailAndPassword(email: string, password: string) {
    const url = environment.baseUrl + 'login/';
    const body = {
      "email": email,
      "password": password
    };
    try {
    let response:any = await lastValueFrom(this.http.post(url, body));
    if (this.remember_me)  localStorage.setItem('token', response.token);
    else this.token =  response.token 
    this.user = response    
    this.request_successful = true;
    setTimeout(() => this.request_successful = false, 3000);
    } catch (error) {
      this.request_error = true;
      setTimeout(() => this.request_error = false, 3000);
    }
  }


  async signUp(email: string, password: string, name: string) {
    const url = environment.baseUrl + 'sign_up/';
    const body = {
      "email": email,
      "password": password,
      "username": name
    };
    try {
     await lastValueFrom(this.http.post(url, body));
     this.request_successful = true;
     setTimeout(() => this.request_successful = false, 3000);
    } catch (error) {
    console.log(error);
    this.request_error = true;
    setTimeout(() => this.request_error = false, 3000);
    }
  }
}

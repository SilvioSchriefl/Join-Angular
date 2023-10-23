import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from './enviroments/enviroments';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token!: string
  remember_me!: boolean
  request_error: boolean = false
  request_successful: boolean = false


  constructor(
    private http: HttpClient,
    public router: Router,
    public userService: UserService
  ) { }


  async loginWithEmailAndPassword(email: string, password: string) {
    const url = environment.baseUrl + 'log_in/';
    const body = {
      "email": email,
      "password": password
    };
    try {
      let response: any = await lastValueFrom(this.http.post(url, body));
      this.userService.user = response
      if (this.remember_me) await this.setLocalStorage(response)
      else this.token = response.token
      this.request_successful = true;
      setTimeout(() => this.request_successful = false, 3000);
      this.remember_me = false
      console.log(response);
    } catch (error) {
      this.request_error = true;
      setTimeout(() => this.request_error = false, 3000);
    }
  }


  async setLocalStorage(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', response.user_name);
    localStorage.setItem('user_id', response.user_id);
    localStorage.setItem('email', response.email);
  }


  async signUp(email: string, password: string, name: string, color:string, initials:string) {
    const url = environment.baseUrl + 'sign_up/';
    const body = {
      "email": email,
      "password": password,
      "username": name,
      "color": color,
      "initials": initials,
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


  async logOut() {

    const url = environment.baseUrl + 'log_out/';
    const body = {
      "email": this.userService.user.email,
    };
    try {
      let response = await lastValueFrom(this.http.post(url, body));
      this.removeDataFromLocalStorage()
      this.router.navigateByUrl('/login');
      console.log(response);
    } catch (error) {
      console.log(error);
      this.request_error = true;
      setTimeout(() => this.request_error = false, 3000);
    }
  }


  removeDataFromLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    this.token = ''
  }
}

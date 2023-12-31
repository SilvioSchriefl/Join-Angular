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
  error_type: string = ''


  constructor(
    private http: HttpClient,
    public router: Router,
    public userService: UserService
  ) { }


  /**
   * logs the user into the backend with email and password
   */
  async loginWithEmailAndPassword(email: string, password: string) {
    const url = environment.baseUrl + 'log_in/';
    const body = {
      "email": email,
      "password": password
    };
    try {
      let response: any = await lastValueFrom(this.http.post(url, body));
      this.userService.current_user = response
      if (this.remember_me) await this.setLocalStorage(response)
      else this.token = response.token
      this.request_successful = true;
      setTimeout(() => this.request_successful = false, 3000);
      this.remember_me = false
    } catch (error) {
      this.request_error = true;
      setTimeout(() => this.request_error = false, 3000);
      console.log(error);
    }
  }


/**
 * saves the data of the logged in user in local storage
 */
  async setLocalStorage(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user_name', response.user_name);
    localStorage.setItem('user_id', response.user_id);
    localStorage.setItem('email', response.email);
    localStorage.setItem('color', response.color);
    localStorage.setItem('initials', response.initials);
    localStorage.setItem('phone', response.phone);
  }


  /**
   * creates a new user in the backend
   */
  async signUp(email: string, password: string, name: string, color: string, initials: string) {
    const url = environment.baseUrl + 'sign_up/';
    const body = {
      "email": email,
      "password": password,
      "user_name": name,
      "color": color,
      "initials": initials,
    };
    try {
      await lastValueFrom(this.http.post(url, body));
      this.request_successful = true;
      setTimeout(() => this.request_successful = false, 3000);
    } catch (error: any) {
      if (error.error.email[0]) this.error_type = 'Email already in use'
      else this.error_type = 'Error creating user'
      this.request_error = true;
      setTimeout(() => this.request_error = false, 3000);
    }
  }


  /**
   * logs out the current user
   */
  async logOut() {
    const url = environment.baseUrl + 'log_out/';
    const body = {
      "email": this.userService.current_user.email,
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


  /**
   * deletes the current user's data from the local storage
   */
  removeDataFromLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    localStorage.removeItem('color');
    localStorage.removeItem('initials');
    localStorage.removeItem('phone');
    this.token = ''
  }


  /**
   * logs the guest in
   */
  async guestLogin() {
    await this.loginWithEmailAndPassword('guest@guest.com', '123')
  }
}

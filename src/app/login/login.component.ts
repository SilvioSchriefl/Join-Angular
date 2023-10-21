import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RouteGuardService } from '../route-guard.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  email!: string
  password!: string
  checkBox_value!: boolean

  constructor(
    public route: Router,
    private http: HttpClient,
    public auth: AuthService,
    public guard: RouteGuardService
  ) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (token) {
      this.guard.authenticated = true;
      this.route.navigate(['/main']);    
    }
  }

  async logIn() {
    await this.auth.loginWithEmailAndPassword(this.email, this.password)
    if (this.auth.request_successful) {
      console.log(this.auth.user);
      
      this.guard.authenticated = true;
      setTimeout(() => {
        this.route.navigateByUrl('/main');
      }, 2500);
    } 
    	else console.log('test login failed');
    console.log(this.auth.user);
    
      
  }

  handleValueChange(event: Event) {
    this.auth.remember_me = this.checkBox_value
  }
}

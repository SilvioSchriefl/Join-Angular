import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RouteGuardService } from '../route-guard.service';
import { UserService } from '../user.service';



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
    public guard: RouteGuardService,
    public userService: UserService,
  ) { }


  /**
   * checks whether a token is stored in local storage. If so, it is redirected to main/summary
   */
  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (token) {
      this.guard.authenticated = true;
      this.route.navigate(['/main/summary']);
    }
  }


  /**
   * logs in the user or the guest user
   * @param loginType user or guest
   */
  async logIn(loginType: string) {
    if(loginType === 'user' ) await this.auth.loginWithEmailAndPassword(this.email, this.password)
    else await this.auth.guestLogin()
    if (this.auth.request_successful) {
      this.guard.authenticated = true;
      setTimeout(() => this.route.navigateByUrl('/main/summary'), 2000);
    }
    else {
      console.log('login failed');
    }
  }

  /**
   * sets the remember me status
   */
  handleValueChange(event: Event) {
    this.auth.remember_me = this.checkBox_value
  }
}

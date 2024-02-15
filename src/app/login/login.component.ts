import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RouteGuardService } from '../route-guard.service';
import { UserService } from '../user.service';
import { GlobalFunctionsService } from '../global-functions.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  email: string = ''
  password: string = ''
  checkBox_value!: boolean
  loading: boolean = false
  guest_loading: boolean = false

  constructor(
    public route: Router,
    public auth: AuthService,
    public guard: RouteGuardService,
    public userService: UserService,
    public globalService: GlobalFunctionsService
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
    if (this.email =='' || this.password == '' && loginType === 'user') return
    if (loginType === 'user') {
      this.loading = true
      await this.auth.loginWithEmailAndPassword(this.email, this.password)
    }
    else {
      this.guest_loading = true
      await this.auth.guestLogin()
    }
      if (this.auth.request_successful) {
        this.guard.authenticated = true;
        this.globalService.log_in = true;
        setTimeout(() => this.globalService.log_in = false, 2500);
        this.route.navigateByUrl('/main/summary')
      }
      else console.log('login failed');
      this.loading = false
      this.guest_loading = false
    }


    /**
     * sets the remember me status
     */
    handleValueChange(event: Event) {
      this.auth.remember_me = this.checkBox_value
    }
  }

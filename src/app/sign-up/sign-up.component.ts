import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { InterceptorService } from '../interceptor.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent {

  user_name: string = '';
  user_email!: string
  password1!: string
  password2!: string
  test: boolean = false
  regexEmail = new RegExp('^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$');
  email_valid: boolean = false
  password_match: boolean = true
  checkBox_value: boolean = false
  acceept_policy: boolean = false
  user_name_empty: boolean = false
  policy_denied: boolean = false

  constructor(
    public router: Router,
    public auth: AuthService,
    public interceptor: InterceptorService,
    public userService: UserService,
  ) { }



  async signUp() {
    if (!this.checkBox_value)  this.policy_denied = true;
    if (this.user_name.length < 1) this.user_name_empty = true
    if (this.password1 != this.password2)  this.password_match = false
    if (!this.email_valid || !this.password_match || !this.acceept_policy || this.user_name_empty) return
    else {
      let color = this.userService.setUsercolor()
      let initials = this.userService.getInitials(this.user_name)
      console.log(initials);
      
      await this.auth.signUp(this.user_email, this.password1, this.user_name, color, initials)
      if (this.auth.request_successful) {
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 3100);
      }
    }
  }



  backToLogin() {
    this.router.navigateByUrl('/login');
  }


  goToPolicy() {
    this.router.navigateByUrl('/private_policy');
  }

  dataChanged(value: string, inputfield: string) {
    this.email_valid = this.regexEmail.test(this.user_email)
   
  }

  handleValueChange() {
    this.acceept_policy = this.checkBox_value
    if (this.acceept_policy) this.policy_denied = false
  }


  inputFocus() {
    this.user_name_empty = false
    this.password_match = true
  }

}

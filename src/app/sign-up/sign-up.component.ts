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

  user_name!: string
  user_email!: string
  password1!: string
  password2!: string
  test: boolean = false
  regexEmail = new RegExp('^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$');
  email_valid: boolean = false
  password_match: boolean = false
  checkBox_value: boolean = false
  acceept_policy: boolean = false

  constructor(
    public router: Router,
    public auth: AuthService,
    public interceptor: InterceptorService,
    public userService: UserService,
  ) { }



  async signUp() {
    this.userService.setInitialsAndUserColor(this.user_name)
    await this.auth.signUp(this.user_email, this.password1, this.user_name, this.userService.user_color, this.userService.user_initials)
    if (this.auth.request_successful) {
      
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 2000);
    }
  }


  backToLogin() {
    this.router.navigateByUrl('/login');
  }

  dataChanged(value: string, inputfield: string) {
    this.email_valid = this.regexEmail.test(this.user_email)
    if (this.password1 === this.password2) this.password_match = true
    else this.password_match = false

  }

  handleValueChange() {
    this.acceept_policy = this.checkBox_value
  }

}

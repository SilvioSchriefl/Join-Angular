import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.sass']
})
export class RestorePasswordComponent {

  constructor(private router: Router) {
    
  }

  email: string = ''


  backToLogin() {
    this.router.navigateByUrl('/login');
  }


}

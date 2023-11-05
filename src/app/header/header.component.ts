import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { GlobalFunctionsService } from '../global-functions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  

  constructor(
    public auth: AuthService,
    public userService: UserService,
    public gblFunctions: GlobalFunctionsService,
    private router: Router
  ) { }



  ngOnInit() {
    let user_name = localStorage.getItem('user_name')
    if (user_name) {
      let user = {
        user_name: localStorage.getItem('user_name'),
        email: localStorage.getItem('email'),
        user_id: localStorage.getItem('user_id'),
        token: localStorage.getItem('token'),
        color: localStorage.getItem('color'),
        initials: localStorage.getItem('initials'),
      }
      this.userService.user = user
    }
  }

  toggleLogoutMenu() {
    this.gblFunctions.menu_open = !this.gblFunctions.menu_open;
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  };


  openHelpView() {
    this.router.navigateByUrl('/main/help')
  }
}

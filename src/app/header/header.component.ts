import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  menu_open: boolean = false;

  constructor(
    public auth: AuthService,
    public userService: UserService,
  ) { }



  ngOnInit() {
    window.addEventListener('click', (event) => {
      if (this.menu_open) this.menu_open = false;
    })
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
      console.log(user);

    }
  }

  toggleLogoutMenu() {
    this.menu_open = !this.menu_open;
    console.log(this.menu_open);
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  };

}

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
    this.userService.getUser()
    window.addEventListener('click', (event) => {
      if (this.menu_open) this.menu_open = false;
    })
  }

  toggleLogoutMenu() {
    this.menu_open = !this.menu_open;
    console.log(this.menu_open);
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  };

}

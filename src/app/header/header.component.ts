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
  animation: boolean= false 

  

  constructor(
    public auth: AuthService,
    public userService: UserService,
    public globalService: GlobalFunctionsService,
    private router: Router
  ) { }



  /**
   * checks whether data is available in the local storage. if so, the storage data is used
   */
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
      this.userService.current_user = user
    }
  }


  /**
   * opens and closes the profile menu
   */
  toggleLogoutMenu() {
    if (this.globalService.menu_open){
      this.animation = true
      setTimeout(() => {
        this.animation = false
        this.globalService.menu_open = false
      }  , 300)
    } 
    else this.globalService.menu_open = true
  }


  /**
   * This opens the help page
   */
  openHelpView() {
    this.router.navigateByUrl('/main/help')
  }


  /**
   * close the logout menu
   */
  closeMenu() {
    this.globalService.menu_open = false
  }
}

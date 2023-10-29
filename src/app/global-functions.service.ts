import { Injectable, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService  {

  menu_open: boolean = false;
  

  constructor(
    public userService: UserService,
  ) { 
    window.addEventListener('click', (event) => {
      console.log('test')
      if (this.menu_open) this.menu_open = false;
      if (this.userService.open_add_user) this.userService.open_add_user = false;
      if (this.userService.open_edit_user) this.userService.open_edit_user = false;
      if (this.userService.open_delete_user) this.userService.open_delete_user = false;
      if (this.userService.open_add_category) this.userService.open_add_category = false
      //if (this.open_dropdown) this.open_dropdown = false;
    })
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  };

  
}

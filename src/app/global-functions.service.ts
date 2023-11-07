import { Injectable, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

  menu_open: boolean = false;
  open_task_details: boolean = false
  open_edit_task: boolean = false
  open_add_task: boolean = false
  animation: boolean = false



  constructor(
    public userService: UserService,
  ) {
    window.addEventListener('click', (event) => {
      if (this.menu_open) this.menu_open = false;
      if (this.userService.open_add_user) this.userService.open_add_user = false;
      if (this.userService.open_edit_user) this.userService.open_edit_user = false;
      if (this.userService.open_delete_user) this.userService.open_delete_user = false;
      if (this.userService.open_add_category) this.userService.open_add_category = false
      if (this.open_edit_task) this.open_edit_task = false
      if (this.open_task_details) this.open_task_details = false
      if (this.open_add_task) {
        this.animation = true
        setTimeout(() => this.open_add_task = false, 500);
        setTimeout(() => this.animation = false, 600);
      }
    })
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  };


}

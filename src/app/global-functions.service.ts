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
      const conditions = [
        this.userService.open_add_user,
        this.userService.open_edit_user,
        this.userService.open_delete_user,
        this.userService.open_add_category,
        this.open_edit_task,
        this.open_task_details,
        this.open_add_task,
        this.menu_open,
      ];

      for (const condition of conditions) {
        if (condition) {
          this.animation = true;
          setTimeout(() => {
            if (condition === this.userService.open_add_user) this.userService.open_add_user = false;
            else if (condition === this.userService.open_edit_user) this.userService.open_edit_user = false;
            else if (condition === this.userService.open_delete_user) this.userService.open_delete_user = false;
            else if (condition === this.userService.open_add_category) this.userService.open_add_category = false;
            else if (condition === this.open_edit_task) this.open_edit_task = false;
            else if (condition === this.open_task_details) this.open_task_details = false;
            else if (condition === this.open_add_task) this.open_add_task = false;
            else if (condition === this.menu_open) this.menu_open = false;
            this.animation = false;
          }, 600);
        }
      }
    });
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  };


}

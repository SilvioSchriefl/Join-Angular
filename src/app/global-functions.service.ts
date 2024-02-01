import { HostListener, Injectable, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

  menu_open: boolean = false;
  open_task_details: boolean = false
  open_edit_task: boolean = false
  open_add_task: boolean = false
  animation: boolean = false
  screen_width: number = 0;
  open_contact_menu: boolean = false;
  open_category: boolean = false
  open_contacts: boolean = false
  open_move_to_menu = false;
  open_dropdown = false;
  log_in: boolean = false;



  /**
   * Closes open popups when clicked outside of the popup
   */
  constructor(
    public userService: UserService,
    private location: Location
  ) {
    this.screen_width = window.innerWidth
    window.addEventListener('click', (event) => {
      const conditions = [
        this.userService.open_add_user,
        this.userService.open_edit_user,
        this.userService.open_delete_user,
        this.userService.open_add_category,
        this.open_edit_task,
        this.open_task_details,
        this.menu_open,
        this.open_contact_menu,
        this.open_move_to_menu,
        this.open_dropdown,
      ];
      for (const condition of conditions) {
        if (condition) {
          this.animation = true;
          this.open_dropdown = false;
          setTimeout(() => {
            if (condition === this.userService.open_add_user) this.userService.open_add_user = false;
            else if (condition === this.userService.open_edit_user) this.userService.open_edit_user = false;
            else if (condition === this.userService.open_delete_user) this.userService.open_delete_user = false;
            else if (condition === this.userService.open_add_category) this.userService.open_add_category = false;
            else if (condition === this.open_edit_task) this.open_edit_task = false;
            else if (condition === this.open_task_details) this.open_task_details = false;
            else if (condition === this.menu_open) this.menu_open = false;
            else if (condition === this.open_contact_menu) this.open_contact_menu = false;
            else if (condition === this.open_move_to_menu) this.open_move_to_menu = false;
            this.animation = false;
          }, 600);
        }
      }
    });
  }

  
  stopPropagation(event: Event) {
    event.stopPropagation();
  };


  goBack() {
    this.location.back();
  }
}

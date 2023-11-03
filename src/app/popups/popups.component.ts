import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { TaskService } from '../task.service';
import { GlobalFunctionsService } from '../global-functions.service';

@Component({
  selector: 'app-popups',
  templateUrl: './popups.component.html',
  styleUrls: ['./popups.component.sass']
})
export class PopupsComponent {

  regexEmail = new RegExp('^[\\w!#$%&’*+/=?`{|}~^-]+(?:\\.[\\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$');

  constructor(
    private auth: AuthService,
    public userService: UserService,
    public taskService: TaskService,
    public globalService: GlobalFunctionsService
  ) { }

 


  closePopup() {
    this.userService.open_add_category = false
    this.userService.open_edit_user = false
    this.userService.open_delete_user = false
    this.userService.open_add_user = false
    this.userService.user_name_empty = false
    this.userService.email_valid = true
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  };


  dataChanged(value: string) {
    this.userService.email_valid = this.regexEmail.test(this.userService.user_email)
   
  }


  inputFocus(inputfield: string) {
    if (inputfield =='name') this.userService.user_name_empty = false
    if (inputfield =='email') this.userService.email_valid = true
  }


  handleAction() {
    if ( this.userService.request_successful || this.userService.request_error) return
    if(this.userService.open_add_user) this.userService.addContact()
    if(this.userService.open_edit_user) this.userService.editContact()
    if(this.userService.open_delete_user) this.userService.deleteContact()
    if(this.userService.open_add_category) this.taskService.addCategory()
  }

}

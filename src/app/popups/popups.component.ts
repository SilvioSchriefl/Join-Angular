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


  /**
   * closes all open popups
   */
  closePopup() {
    this.globalService.animation = true
    setTimeout(() => this.globalService.animation = false, 600);
    setTimeout(() => {
      this.userService.open_add_category = false
      this.userService.open_edit_user = false
      this.userService.open_delete_user = false
      this.userService.open_add_user = false
      this.userService.user_name_empty = false
      this.userService.email_valid = true
    }, 600);

  }


  /**
   * checks whether it is a valid email
   * @param value email-text
   */
  dataChanged(value: string) {
    this.userService.email_valid = this.regexEmail.test(this.userService.user_email)
  }


  /**
   * Removes an error message when the input field is clicked
   */
  inputFocus(inputfield: string) {
    if (inputfield == 'name') this.userService.user_name_empty = false
    if (inputfield == 'email') this.userService.email_valid = true
  }


  /**
   * Depending on which popup is open, the corresponding function is called
   */
  async handleAction() {
    if (this.userService.request_successful || this.userService.request_error) return
    if (this.userService.open_add_user) await this.userService.addContact()
    if (this.userService.open_edit_user) await this.userService.editContact()
    if (this.userService.open_delete_user) {
      await this.deleteAndUpdateTask()
      if (this.userService.show_contact) this.userService.show_contact = false
    }
    if (this.userService.open_add_category && this.userService.category_title.length > 0) await this.taskService.addCategory()
    if (this.userService.request_successful) {
      this.globalService.animation = true
      setTimeout(() => this.globalService.animation = false, 2100)
    }
  }


  /**
   * deletes the selected contact
   */
  async deleteAndUpdateTask() {
    await this.userService.deleteContact()
    if (this.userService.request_successful) this.taskService.updateAssignedTaskContacts(this.userService.user_details.email)
  }


  /**
   * Closes the add task functionality, including animations and dropdown.
   */
  closeAddTask() {
    this.globalService.animation = true;
    this.globalService.open_dropdown = false;
    setTimeout(() => {
      this.globalService.open_add_task = false;
      this.globalService.animation = false;
    }, 600);
  }
}

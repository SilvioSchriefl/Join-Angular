import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalFunctionsService } from '../global-functions.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.sass']
})
export class ContactsComponent implements OnInit {



  letter: string = '';
  sort_letter: string = '';
  screen_width: number = 0;
  animation: boolean = false;


  constructor(
    public userService: UserService,
    public globalService: GlobalFunctionsService
  ) { }


  async ngOnInit() {
    console.log(this.userService.all_users)
    this.userService.show_contact = false
    this.screen_width = window.innerWidth
    await this.userService.getUsersAndContacts()
    this.userService.user_details = {
      user: '',
      email: '',
      phone: '',
      initials: '',
      color: '',
      id: '',
      user_contact: false,
      index: 0,
      created_by: ''
    }
  }


  /**
   * Determines the screen width when changing the window
   * @param event window resize
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screen_width = window.innerWidth;
  }


  /**
   * determines whether the next user has a different initial letter
   * @param name user-name
   * @returns true or false
   */
  checkForNewFirstLetter(name: string, i: number) {
    let test = this.userService.all_users.filter((user: { user_name: string; }) => user.user_name.charAt(0).toUpperCase() == 'G')
    if (test.length == 1 && name == 'Guest') return false
    if (i === 0) return true;
    else {
      let firstLetter = name.charAt(0).toUpperCase()
      let previous_firstLetter = this.userService.all_users[i - 1].user_name.charAt(0).toUpperCase();
      if (firstLetter !== previous_firstLetter && name) return true;
      else return false;
    }
  }


  /**
   * 
   * @param name user-name
   * @returns first letter of trhe user-name
   */
  getLetter(name: string) {
    return name.charAt(0).toUpperCase()
  }


  /**
   * fills the variables with the data of the selected contact and displays it
   */
  showContact(i: number) {
    this.userService.show_contact = true
    this.userService.user_details.user = this.userService.all_users[i].user_name
    this.userService.user_details.email = this.userService.all_users[i].email
    this.userService.user_details.initials = this.userService.all_users[i].initials
    this.userService.user_details.color = this.userService.all_users[i].color
    this.userService.user_details.phone = this.userService.all_users[i].phone
    this.userService.user_details.id = this.userService.all_users[i].id
    this.userService.user_details.user_contact = this.userService.all_users[i].user_contact
    this.userService.user_details.created_by = this.userService.all_users[i].created_by
    this.userService.user_details.index = i
  }


  /**
   * closes the mobile contact view
   */
  closeContactViewMobile() {
    this.animation = true
    setTimeout(() => {
      this.userService.show_contact = false
      this.animation = false
    }, 190)


  }


  /**
   * opens the respective popup based on the transmitted parameter
   * @param popup add, edit or delete
   */
  openPopup(popup: string) {
    this.globalService.open_contact_menu = false
    this.userService.user_name = ''
    this.userService.user_email = ''
    this.userService.user_phone = ''
    if (popup == 'add') this.userService.open_add_user = true
    if (popup == 'edit' || popup == 'delete') {
      this.userService.user_name = this.userService.user_details.user
      this.userService.user_email = this.userService.user_details.email
      this.userService.user_phone = this.userService.user_details.phone
      if (popup == 'edit') this.userService.open_edit_user = true
      if (popup == 'delete') this.userService.open_delete_user = true
    }
  }


  /**
   *  opens the contact menu for the mobile view
   */
  openContactMenu() {
    if (!this.userService.user_details.user_contact || this.userService.current_user.user_id != this.userService.user_details.created_by) return
    else this.globalService.open_contact_menu = true
  }


  /**
   * shows the user who created the contact
   */
  showCreator() {
    this.showContact(this.userService.creator_index)
  }
}

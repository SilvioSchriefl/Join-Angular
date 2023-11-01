import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalFunctionsService } from '../global-functions.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.sass']
})
export class ContactsComponent implements OnInit {



  letter: string = '';
  sort_letter: string = '';


  constructor(
    public userService: UserService,
    public gblFunctions: GlobalFunctionsService
    ) { }


  async ngOnInit() {
    await this.userService.getUsersAndContacts()
    this.userService.user_details  = {
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


  checkForNewFirstLetter(name: string, i: number) {
    if (i === 0) return true;
    else {
      let firstLetter = name.charAt(0).toUpperCase()
      let previous_firstLetter = this.userService.all_users[i - 1].user_name.charAt(0).toUpperCase();
      if (firstLetter !== previous_firstLetter) return true;
      else return false;
    }
  }


  getLetter(name: string) {
    return name.charAt(0).toUpperCase()
  }


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
    console.log(i);
    
  }


  openPopup(popup: string) {
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


  showCreator() {
    this.showContact(this.userService.creator_index)
  }
}

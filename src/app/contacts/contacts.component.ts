import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.sass']
})
export class ContactsComponent implements OnInit {


  show_contact = false;
  letter: string = '';
  sort_letter: string = '';
  user_details = {
    user: '',
    email: '',
    phone: '',
    initials: '',
    color: ''
  }

  constructor(public userService: UserService) { }


  async ngOnInit() {
   await this.userService.getUsers()
  }


  checkForNewFirstLetter(name: string, i:number)  {
    if (i === 0) return true;
    else{
    let firstLetter = name.charAt(0);
    let previous_firstLetter = this.userService.all_users[i-1].user_name.charAt(0);
    if (firstLetter!== previous_firstLetter) return true;
    else return false;
    }
  }


  getLetter(name: string) {
    return name.charAt(0).toUpperCase()
  }


  showContact(i: number) {
    this.show_contact = true
    this.user_details.user = this.userService.all_users[i].user_name
    this.user_details.email = this.userService.all_users[i].email
    this.user_details.initials = this.userService.all_users[i].initials
    this.user_details.color = this.userService.all_users[i].color
}
}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.sass']
})
export class ContactsComponent implements OnInit {

  letter: string = '';
  sort_letter: string = '';

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

}

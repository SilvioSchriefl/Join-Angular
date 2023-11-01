import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  show_contact: boolean = false;
  user: any
  all_users: any
  open_add_user: boolean = false;
  open_edit_user: boolean = false;
  open_delete_user: boolean = false;
  open_add_category: boolean = false;
  user_name: string = '';
  user_email: string = '';
  user_phone: string = '';
  request_successful: boolean = false;
  error_type: string = '';
  request_error: boolean = false;
  email_valid: boolean = true;
  user_name_empty: boolean = false;
  all_contacts: any = [];
  category_title: string = ''
  creator: any = []
  creator_index: number = 0
  user_details = {
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


  constructor(
    private http: HttpClient,
  ) { }


  setUsercolor() {
    let colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FF0000', '#00FF00', '#A52A2A', '#808080', '#FFC0CB', '#800080', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B']
    let random_index = Math.floor(Math.random() * colors.length);
    return colors[random_index]
  }


  getInitials(name: string) {
    let initials = ''
    const words = name.split(' ');
    for (let i = 0; i < words.length; i++) {
      initials += words[i].charAt(0).toUpperCase();
    }
    return initials
  }


  async getUsersAndContacts() {
    const usersUrl = environment.baseUrl + 'users/';
    const contactsUrl = environment.baseUrl + 'contacts/';

    try {

      const usersResponse = await lastValueFrom(this.http.get(usersUrl));
      const contactsResponse = await lastValueFrom(this.http.get(contactsUrl));
      this.all_users = usersResponse;
      this.all_contacts = contactsResponse;
      this.all_contacts.forEach((contact: any) => {
        this.all_users.push(contact);
      });
      this.sortUserByLetter();
    } catch (error) {
      console.log(error);
    }
  }


  sortUserByLetter() {
    this.all_users.sort((a: { user_name: string; }, b: { user_name: any; }) => a.user_name.localeCompare(b.user_name));
  }


  async addContact() {
    if (this.user_name == '') this.user_name_empty = true
    if (!this.user_email) this.email_valid = false
    if (!this.email_valid || !this.user_name) return
    else {
      let color = this.setUsercolor()
      let initials = this.getInitials(this.user_name)
      const url = environment.baseUrl + 'add_contact/'
      const body = {
        "email": this.user_email,
        "phone": this.user_phone,
        "user_name": this.user_name,
        "color": color,
        "initials": initials,
      };
      try {
        await this.saveContact(url, body);
      } catch (error: any) {
        this.handleError(error);
      }
    }
  }



  async saveContact(url: string, body: { email: string; phone: string; user_name: string; color: string; initials: string; }) {
    let response = await lastValueFrom(this.http.post(url, body));
    this.request_successful = true;
    setTimeout(() => {
      this.request_successful = false
      this.open_add_user = false
      this.all_users.push(response)
      this.sortUserByLetter()
    }, 2000);
  }


  handleError(error: any) {
    if (this.open_add_user) {
      if (error.error.email) this.error_type = error.error.email;
      else this.error_type = 'Error creating contact'
    }
    if (this.open_delete_user) {
      if (error.error.detail) this.error_type = error.error.detail;
      else this.error_type = 'Error delete contact'
    }
    this.request_error = true;
    setTimeout(() => this.request_error = false, 2000);
  }


  async editContact() {
    let i = this.user_details.index
    const url = environment.baseUrl + 'edit_contact/' + this.user_details.id + '/'
    const body = {
      "email": this.user_email,
      "phone": this.user_phone,
      "user_name": this.user_name,
      "color": this.user_details.color,
      "initials": this.getInitials(this.user_name),
      "created_by": this.user_details.created_by
    };
    try {
      let response = await lastValueFrom(this.http.put(url, body));
      this.request_successful = true;
      setTimeout(() => {
        this.request_successful = false
        this.open_edit_user = false
        this.all_users[i] = response
        this.sortUserByLetter()
        this.updateUserDetail(response)
      }, 2000);
    } catch (error: any) {
      this.handleError(error)
      console.log(error);
      
    }
  }


  async deleteContact() {
    console.log('test');
    
    let i = this.user_details.index;
    let url = environment.baseUrl + 'delete_contact/' + this.user_details.id + '/';
    try {
      await lastValueFrom(this.http.delete(url));
      this.request_successful = true;
      setTimeout(() => {
        this.all_users.splice(i, 1);
        this.request_successful = false;
        this.open_delete_user = false;
        this.show_contact = false;
        this.sortUserByLetter();
      }, 2000);
    } catch (error: any) {
      this.handleError(error);
    }
  }


  updateUserDetail(response: any) {
    this.user_details.user = response.user_name
    this.user_details.email = response.email
    this.user_details.phone = response.phone
  }


  getUserName() {
    if (this.user_details.user !== '') {
      let users = this.all_users.filter((user: { user_contact: boolean; }) => user.user_contact === false);
      let creator_id = this.user_details.created_by;
      let user_index = users.findIndex((user: any) => user.id === creator_id);
      this.creator = users[user_index];
      this.creator_index = this.all_users.findIndex((user: any) => user.email === this.creator.email)
      if (user_index !== -1) return users[user_index].user_name;
      else return 'Benutzer nicht gefunden'; // Oder einen anderen Standardwert 
    }
  }
}


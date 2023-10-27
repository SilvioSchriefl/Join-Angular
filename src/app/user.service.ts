import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any
  all_users: any
  open_add_user: boolean = false;
  open_edit_user: boolean = false;
  open_delete_user: boolean = false;
  user_name: string = '';
  user_email: string = '';
  user_phone: string = '';
  request_successful: boolean = false;
  error_type: string = '';
  request_error: boolean = false;
  email_valid: boolean = true;
  user_name_empty: boolean = false;
  all_contacts: any = [];
  user_details = {
    user: '',
    email: '',
    phone: '',
    initials: '',
    color: '',
    id: '',
    contact: false,
    index: 0
  }


  constructor(
    private http: HttpClient,
  ) { }


  setUsercolor() {
    let colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B']
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


  async getUsers() {
    const url = environment.baseUrl + 'users/';
    try {
      let response = await lastValueFrom(this.http.get(url));
      console.log(response);
      this.all_users = response
      console.log(this.all_users);
    } catch (error) {
      console.log(error);
    }
    await this.getContacts()
  }


  async getContacts() {
    const url = environment.baseUrl + 'contacts/';
    try {
      let response = await lastValueFrom(this.http.get(url))
      this.all_contacts = response
      this.all_contacts.forEach((contact: any) => {
        this.all_users.push(contact)
      });
      this.sortUserByLetter()
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
        this.loadContacts()
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
    if (error.error.email == "Email already in use") this.error_type = error.error.email;
    else this.error_type = 'Error creating contact'
    this.request_error = true;
    setTimeout(() => this.request_error = false, 2000);
    console.log(error);
  }


  async loadContacts() {
    const url = environment.baseUrl + 'contacts/'
    await lastValueFrom(this.http.get(url));
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
    }
  }


  deleteContact() {
    let i = this.user_details.index
  }


  updateUserDetail(response: any) {
    this.user_details.user = response.user_name
    this.user_details.email = response.email
    this.user_details.phone = response.phone
  }
}


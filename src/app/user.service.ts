import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user:any
  user_initials = ''
  user_color = ''

  constructor(
  
  ) { }

  setUsercolor() {
    let colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B']
    let random_index = Math.floor(Math.random() * colors.length);
    this.user_color = colors[random_index]
  }


  getUser() {
    let user = localStorage.getItem('user')
    if (user) {
      let user = {
        user: localStorage.getItem('user'),
        email: localStorage.getItem('email'),
        user_id: localStorage.getItem('user_id'),
        token: localStorage.getItem('token'),
      }
      this.user = user
      this.getInitials(this.user.user)
    }
  }


  getInitials(name:string) {
    this.user_initials = ''
    const words = name.split(' ');
    for (let i = 0; i < words.length; i++) {
      this.user_initials += words[i].charAt(0).toUpperCase();
    }
  }


  setInitialsAndUserColor(name: string) {
    this.setUsercolor()
    this.getInitials(name)
    console.log(this.user_initials, this.user_color);
    
  }
}

import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService  {
  user:any


  constructor(
  
  ) { }


 

  setUsercolor() {
    let colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B']
    let random_index = Math.floor(Math.random() * colors.length);
    return colors[random_index]
  }


  


  getInitials(name:string) {
    let initials = ''
    const words = name.split(' ');
    for (let i = 0; i < words.length; i++) {
      initials += words[i].charAt(0).toUpperCase();
    }
    return  initials
  }


  saveUser() {
}
}

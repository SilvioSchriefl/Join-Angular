import { Component } from '@angular/core';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {

  
/**
 * deletes the data from local storage
 */
  logout() {
    localStorage.removeItem('token');
  }
}

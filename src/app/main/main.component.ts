import { Component } from '@angular/core';
import { GlobalFunctionsService } from '../global-functions.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {

  constructor(
    public globalService: GlobalFunctionsService
  ) {}

  
/**
 * deletes the data from local storage
 */
  logout() {
    localStorage.removeItem('token');
  }
}

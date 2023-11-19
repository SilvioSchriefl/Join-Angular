import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.sass']
})
export class StartScreenComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
    this.router.navigateByUrl('/login');
  }

  signUp() {
    this.router.navigateByUrl('/sign_up');
  }


  navigateTo(link: string) {
    this.router.navigateByUrl(`/${link}`)
  }
}

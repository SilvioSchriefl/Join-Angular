import { Injectable } from '@angular/core';
import { environment } from './enviroments/enviroments';
import { UserService } from './user.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  all_categorys: any = [];

  constructor(
    public userService: UserService,
    private http: HttpClient
  ) { }



  async addCategory() {
    let url = environment.baseUrl + 'category/';
    let body = {
      'title': this.userService.category_title,
      'color': this.userService.setUsercolor()
    }
    try {
      let response = await lastValueFrom(this.http.post(url, body));
      console.log(response)
      this.all_categorys.push(response)
    }
    catch (error) {
      console.log(error);
    }
  }


  async getCategorys() {
    let url = environment.baseUrl + 'category/';
    try {
      let response = await lastValueFrom(this.http.get(url));
      this.all_categorys = response
    }
    catch (error) {
    }
  }


  async deleteCategory(i: number) {
    let id = this.all_categorys[i].id
    let url = environment.baseUrl + 'category/' + id + '/'
    try {
      await lastValueFrom(this.http.delete(url));
      this.all_categorys.splice(i, 1)
    }
    catch (error) {

    }
  }
}

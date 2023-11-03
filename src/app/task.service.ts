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
  all_tasks: any = [];

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
      this.all_categorys.push(response)
      this.userService.request_successful = true;
      setTimeout(() => {
        this.userService.request_successful = false
        this.userService.open_add_category = false
      }, 2000);
    }
    catch (error: any) {
      this.userService.request_error = true;
      setTimeout(() => this.userService.request_error = false, 2000);
      if (error.error.detail) this.userService.error_type = error.error.detail
      else this.userService.error_type = 'Error creating category'
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


  async addTask(body: any) {
    let url = environment.baseUrl + 'task/'
    try {
      let response = await lastValueFrom(this.http.post(url, body));
      this.all_tasks.push(response)
      this.userService.request_successful = true;
      setTimeout(() => this.userService.request_successful = false, 3000);
    }
    catch (error) {
      console.log(error);
      this.userService.request_error = true;
      setTimeout(() => this.userService.request_error = false, 3000);
    }
    console.log(this.all_tasks);

  }


  async getAllTasks() {
    let url = environment.baseUrl + 'task/'
    try {
      this.all_tasks = await lastValueFrom(this.http.get(url))
    }
    catch (error) {
      console.log(error);
    }
  }


  async updateTask(id: string, status: string) {
    let url = environment.baseUrl + 'task/'
    let body = {
      id: id,
      status: status,
    }
    try {
      await lastValueFrom(this.http.patch(url, body))
    }
    catch (error) {
      console.log(error);
    }
  }
}

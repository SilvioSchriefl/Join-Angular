import { Injectable } from '@angular/core';
import { environment } from './enviroments/enviroments';
import { UserService } from './user.service';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  all_categorys: any = [];
  all_tasks: any = [];
  request_successful: boolean = false;
  request_error: boolean = false;
  error_type: string = ''
  task_status: string = ''
  private taskSubject = new BehaviorSubject<string[]>(this.all_tasks);


  constructor(
    public userService: UserService,
    private http: HttpClient
  ) { }

  getTasks() {
    return this.taskSubject.asObservable();
  }

  async addCategory() {
    let url = environment.baseUrl + 'category/';
    let body = {
      'title': this.userService.category_title,
      'color': this.userService.setUsercolor(),
      'creator_email': this.userService.user.email
    }
    try {
      let response = await lastValueFrom(this.http.post(url, body));
      this.all_categorys.push(response)
      this.userService.request_successful = true;
      setTimeout(() => {
        this.request_successful = false
        this.userService.open_add_category = false
      }, 2000);
    }
    catch (error: any) {
      this.userService.request_error = true;
      setTimeout(() => this.request_error = false, 2000);
      if (error.error.detail) this.error_type = error.error.detail
      else this.error_type = 'Error creating category'
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
      this.taskSubject.next(this.all_tasks);
      this.request_successful = true;
      setTimeout(() => this.request_successful = false, 2000);
    }
    catch (error) {
      console.log(error);
      this.request_error = true;
      setTimeout(() => this.request_error = false, 2000);
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


  async updateTask(body: any) {
    let url = environment.baseUrl + 'task/'
    try {
      await lastValueFrom(this.http.patch(url, body))
      this.request_successful = true;
      setTimeout(() => this.request_successful = false , 2000);
    }
    catch (error) {
      this.request_error = true;
      setTimeout(() => this.request_error = false, 2000);
      this.error_type = 'Error saving task'
    }
  }


  async deleteTask(id: string) {
    {
      let url = environment.baseUrl + 'task/' + id + '/'
      try {
        await lastValueFrom(this.http.delete(url))
        this.request_successful = true;
        setTimeout(() => this.request_successful = false , 2000);
      }
      catch (error) {
        this.request_error = true;
        setTimeout(() => this.request_error = false, 2000);
        this.error_type = 'Error delete task'
      }
    }
  }
}

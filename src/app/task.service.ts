import { Injectable } from '@angular/core';
import { environment } from './enviroments/enviroments';
import { UserService } from './user.service';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalFunctionsService } from './global-functions.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  task_status_in_progress: any = []
  task_status_todo: any = []
  task_status_done: any = []
  task_status_await: any = []
  all_categorys: any = [];
  all_tasks: any = [];
  request_successful: boolean = false;
  request_error: boolean = false;
  error_type: string = ''
  task_status: string = ''
  private taskSubject = new BehaviorSubject<string[]>(this.all_tasks);


  constructor(
    public userService: UserService,
    private http: HttpClient,
    private  globalService: GlobalFunctionsService
  ) { }


  getTasks() {
    return this.taskSubject.asObservable();
  }


  filterTaskbyStatus() {
    this.task_status_todo = this.all_tasks.filter((task: any) => task.status === 'todo')
    this.task_status_in_progress = this.all_tasks.filter((task: any) => task.status === 'progress')
    this.task_status_await = this.all_tasks.filter((task: any) => task.status === 'await')
    this.task_status_done = this.all_tasks.filter((task: any) => task.status === 'done')
  }


  async addCategory() {
    let url = environment.baseUrl + 'category/';
    let body = {
      'title': this.userService.category_title,
      'color': this.userService.setUsercolor(),
      'creator_email': this.userService.current_user.email
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


  async addTask(body: any) {
    let url = environment.baseUrl + 'task/'
    try {
      let response = await lastValueFrom(this.http.post(url, body));
      this.all_tasks.push(response)
      this.taskSubject.next(this.all_tasks);
      this.setBoolians()
    }
    catch (error: any) {
      this.request_error = true;
      setTimeout(() => this.request_error = false, 2000);
      if (error.error.detail) this.error_type = error.error.detail
      else this.error_type = 'Error creating Task'
    }
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


  async updateTask(body: any, event: string) {
    let url = environment.baseUrl + 'task/'
    try {
      await lastValueFrom(this.http.patch(url, body))
      this.taskSubject.next(this.all_tasks);
      if(event != 'itemDrop') this.setBoolians()
    }
    catch (error) {
      this.request_error = true;
      setTimeout(() => this.request_error = false, 2000);
      this.error_type = 'Error saving task'
      console.log(error);
    }
  }


  async deleteTask(id: string) {
    {
      let url = environment.baseUrl + 'task/' + id + '/'
      try {
        await lastValueFrom(this.http.delete(url))
        this.taskSubject.next(this.all_tasks);
        this.setBoolians()
      }
      catch (error) {
        this.request_error = true;
        setTimeout(() => this.request_error = false, 2000);
        this.error_type = 'Error delete task'
      }
    }
  }


  setBoolians() {
    this.request_successful = true;
    this.globalService.animation = true
    setTimeout(() =>  this.request_successful = false , 2000);
    setTimeout(() =>  this.globalService.animation = false , 2100);
  }


  updateAssignedTaskContacts(email: string) {
    this.all_tasks.forEach((task:any) => {
      if(task.assigned_emails.includes(email)) {
        let i = task.assigned_emails.indexOf(email)
        task.assigned_emails.splice(i, 1);
        let body = {
          id: task.id,
          assigned_emails: task.assigned_emails
        }
        this.updateTask(body, 'contact')
      }
    });
  }
}

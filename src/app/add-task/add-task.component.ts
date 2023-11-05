import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalFunctionsService } from '../global-functions.service';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.sass']
})
export class AddTaskComponent implements OnInit {


  delete_index: number = 0;
  description: string = '';
  date: string = ''
  min_date: string = ''
  prio: string = ''
  checkBox_value: boolean = false
  selected_contacts: any = []
  selected_contacts_list: any = []
  selected_users: any = []
  rotationValue: string = 'rotate(0deg)'
  search_value: string = ''
  all_contacts: any = []
  open_category: boolean = false
  open_dropdown: boolean = false
  rotationValueC: string = 'rotate(0deg)';
  selected_category: any = []
  subtasks: any = []
  subtask_title: string = ''
  edit_subtask: boolean = false
  edited_subtask_title: string = ''
  task_title: string = ''
  title_error: boolean = false
  category_error: boolean = false
  deleted: boolean = false



  constructor(
    public userService: UserService,
    public globalService: GlobalFunctionsService,
    public taskService: TaskService,
    public router: Router,

  ) { }

  async ngOnInit() {
    await this.taskService.getCategorys()
    this.getCurrentDate()
    await this.userService.getUsersAndContacts()
    this.all_contacts = this.userService.all_users
    this.taskService.task_status = 'todo'
  }


  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (this.open_dropdown) {
      if (this.rotationValue == 'rotate(0deg)') this.rotationValue = 'rotate(180deg)'
      else this.rotationValue = 'rotate(0deg)'
      this.open_dropdown = false;
    }
    if (this.open_category) {
      if (this.rotationValueC == 'rotate(0deg)') this.rotationValueC = 'rotate(180deg)'
      else this.rotationValueC = 'rotate(0deg)'
      this.open_category = false
    }
  }


  getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    this.date = `${year}-${month}-${day}`;
    this.min_date = this.date
  }


  selectContact(i: number) {
    this.handleTaskView(i)
    let contact = this.userService.all_users[i];
    if (this.selected_users.includes(contact)) {
      let index = this.selected_users.indexOf(contact);
      this.selected_users.splice(index, 1);
    } else {
      this.selected_users.push(contact.email);
    }
    console.log(this.selected_users);
  }


  handleTaskView(i: number) {
    let contact = this.userService.all_users[i];
    if (this.selected_contacts_list.includes(contact)) {
      const index = this.selected_contacts_list.indexOf(contact);
      this.selected_contacts_list.splice(index, 1);
      this.userService.all_users[i].selected = false
    } else {
      this.userService.all_users[i].selected = true
      this.selected_contacts_list.push(contact);
    }
  }


  toggleDropDownMenu(menu: string) {
    if (menu == 'contact') {
      this.open_dropdown = !this.open_dropdown;
      if (this.open_dropdown) {
        this.all_contacts = this.userService.all_users
        this.search_value = ''
      }
      if (this.rotationValue == 'rotate(0deg)') this.rotationValue = 'rotate(180deg)'
      else this.rotationValue = 'rotate(0deg)'
    }
    if (menu == 'category') {
      this.open_category = !this.open_category
      if (this.rotationValueC == 'rotate(0deg)') this.rotationValueC = 'rotate(180deg)'
      else this.rotationValueC = 'rotate(0deg)'
    }
  }


  handleValueChange(value: any) {
    this.all_contacts = this.userService.all_users.filter((user: { user_name: string }) =>
      user.user_name.toLowerCase().includes(this.search_value.toLowerCase())
    );
  }


  setPrio(prio: string) {
    this.prio = prio
  }


  openAddContact() {
    this.userService.user_name = ''
    this.userService.user_email = ''
    this.userService.user_phone = ''
    this.userService.open_add_user = true
  }


  openAddCategory() {
    this.userService.category_title = ''
    this.userService.open_add_category = true
  }


  deleteCategory(i: number) {
    this.delete_index = i
    this.deleted = true
    setTimeout(() => {
      this.taskService.deleteCategory(i)
      this.deleted = false
    }, 190);
    
  }


  setCategory(i: number) {
    this.selected_category = this.taskService.all_categorys[i]
    this.open_category = false
    if (this.rotationValueC == 'rotate(0deg)') this.rotationValueC = 'rotate(180deg)'
    else this.rotationValueC = 'rotate(0deg)'
  }


  addSubtask() {
    if (this.subtask_title.length > 0) {
      let subtask = {
        title: this.subtask_title,
        done: false
      }
      this.subtasks.push(subtask)
      this.subtask_title = ''
    }
  }


  deleteSubtask(i: number) {
    this.subtasks.splice(i, 1)
  }


  openEditSubtask(i: number) {
    this.subtasks[i].selected = true
    this.edited_subtask_title = this.subtasks[i].title
  }


  saveEditSubtask(i: number) {
    this.subtasks[i].title = this.edited_subtask_title
    this.subtasks[i].selected = false
  }


  clearAll() {
    this.selected_category = []
    this.selected_contacts = []
    this.selected_users = []
    this.selected_contacts_list = []
    this.task_title = ''
    this.description = ''
    this.date = this.min_date
    this.prio = ''
    this.subtasks = []
  }


  createTask() {
    if (this.task_title.length === 0 ) this.title_error = true 
    if (this.selected_category.length === 0 ) this.category_error = true 
    if (this.selected_category.length === 0 || this.task_title.length == 0 ) return
    let body = {
      title: this.task_title,
      description: this.description,
      due_date: this.date,
      status: this.taskService.task_status,
      assigned_emails: this.selected_users,
      category_title: this.selected_category.title,
      category_color: this.selected_category.color,
      subtasks: this.subtasks,
      prio: this.prio,
    }
    this.taskService.addTask(body)
    this.clearAll()
    setTimeout(() => {
      this.router.navigateByUrl('/main/board')
      this.globalService.open_add_task = false
    } , 2000)
    
  }


  removeError(error:string) {
     if(error == 'title') this.title_error = false
    if (error == 'category') this.category_error = false
  }
}
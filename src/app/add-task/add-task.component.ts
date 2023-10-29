import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalFunctionsService } from '../global-functions.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.sass']
})
export class AddTaskComponent implements OnInit {

  description: string = '';
  title: string = ''
  date: string = ''
  min_date: string = ''
  prio: string = ''
  checkBox_value: boolean = false
  selected_contacts: any = []
  selected_contact_index: number = 0
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



  constructor(
    public userService: UserService,
    public gblFunctions: GlobalFunctionsService,
    public taskService: TaskService
  ) {

  }

  async ngOnInit() {
    await this.taskService.getCategorys()
    this.getCurrentDate()
    await this.userService.getUsers()
    this.all_contacts = this.userService.all_users
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
    let contact = this.userService.all_users[i];
    if (this.selected_contacts.includes(contact)) {
      const index = this.selected_contacts.indexOf(contact);
      if (index > -1) {
        this.selected_contacts.splice(index, 1);
      }
      contact.selected = false;
    } else {
      this.selected_contacts.push(contact);
      contact.selected = true;
    }
  }


  toggleDropDownMenu(menu: string) {
    if (menu == 'contact') {
      if (!this.open_dropdown) this.open_dropdown = true;
      else {
        this.all_contacts = this.userService.all_users
        this.open_dropdown = false;
        this.search_value = ''
      }
      if (this.rotationValue == 'rotate(0deg)') this.rotationValue = 'rotate(180deg)'
      else this.rotationValue = 'rotate(0deg)'
    }
    if (menu == 'category') {
      if (!this.open_category) this.open_category = true
      else this.open_category = false
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
    this.userService.open_add_user = true
  }


  openAddCategory() {
    this.userService.category_title = ''
    this.userService.open_add_category = true
  }


  deleteCategory(i: number) {
    this.taskService.deleteCategory(i)
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
    this.task_title = ''
    this.description = ''
    this.date = this.min_date
    this.prio = ''
    this.subtasks = []
  }


  createTask() {
    
  }
}
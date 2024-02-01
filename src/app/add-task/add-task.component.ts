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
    this.clearAll()
    await this.taskService.getCategorys()
    this.getCurrentDate()
    await this.userService.getUsersAndContacts()
    this.all_contacts = this.userService.all_users
    this.taskService.task_status = 'todo'
  }


  /**
   * When you click on the screen, close the contact menu and the category menu and set the arrows in the appropriate direction
   */
  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (this.globalService.open_contacts) {
      if (this.rotationValue == 'rotate(0deg)') this.rotationValue = 'rotate(180deg)'
      else this.rotationValue = 'rotate(0deg)'
      this.globalService.open_contacts = false;
    }
    if (this.globalService.open_category) {
      if (this.rotationValueC == 'rotate(0deg)') this.rotationValueC = 'rotate(180deg)'
      else this.rotationValueC = 'rotate(0deg)'
      this.globalService.open_category = false
    }
  }


  /**
   * determines the current date
   */
  getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    this.date = `${year}-${month}-${day}`;
    this.min_date = this.date
  }


  /**
   * determines whether the contact has already been selected and deletes it or adds it
   */
  selectContact(i: number) {
    this.handleTaskView(i)
    let contact = this.userService.all_users[i];
    if (this.selected_users.includes(contact.email)) {
      let index = this.selected_users.indexOf(contact.email);
      this.selected_users.splice(index, 1);
    } else this.selected_users.push(contact.email);
  }


  /**
   * displays the selected contacts visually
   */
  handleTaskView(i: number) {
    let contact = this.userService.all_users[i];
    if (this.selected_contacts_list.includes(contact)) {
      const index = this.selected_contacts_list.indexOf(contact);
      this.selected_contacts_list.splice(index, 1);
      this.all_contacts[i].selected = false
    } else {
      this.all_contacts[i].selected = true
      this.selected_contacts_list.push(contact);
    }
  }


  /**
   * Closes and opens the Contact and Category menus and changes the direction of the menu arrow accordingly
   */
  toggleDropDownMenu(menu: string) {
    if (menu == 'contact') {
      this.globalService.open_contacts = !this.globalService.open_contacts;
      if (this.globalService.open_contacts) {
        this.all_contacts = this.userService.all_users
        this.search_value = ''
      }
      if (this.rotationValue == 'rotate(0deg)') this.rotationValue = 'rotate(180deg)'
      else this.rotationValue = 'rotate(0deg)'
    }
    if (menu == 'category') {
      this.globalService.open_category = !this.globalService.open_category
      if (this.rotationValueC == 'rotate(0deg)') this.rotationValueC = 'rotate(180deg)'
      else this.rotationValueC = 'rotate(0deg)'
    }
  }


  /**
   * filters the contacts based on the letters entered
   * 
   * @param search text 
   */
  handleValueChange(value: any) {
    this.all_contacts = this.userService.all_users.filter((user: { user_name: string }) =>
      user.user_name.toLowerCase().includes(this.search_value.toLowerCase())
    );
  }


  /**
   * sets the priorities
   * 
   * @param urgent, medium or low 
   */
  setPrio(prio: string) {
    this.prio = prio
  }


  /**
   * opens the add user menu
   */
  openAddContact() {
    this.userService.user_name = ''
    this.userService.user_email = ''
    this.userService.user_phone = ''
    this.userService.open_add_user = true
  }


  /**
   * opens the add category menu
   */
  openAddCategory() {
    this.userService.category_title = ''
    this.userService.open_add_category = true
  }


  /**
   *  deletes the selected category
   */
  deleteCategory(i: number) {
    this.delete_index = i
    this.deleted = true
    setTimeout(() => {
      this.taskService.deleteCategory(i)
      this.deleted = false
    }, 190);

  }


  /**
   *  assigns the selected category to the variable and closes the menu
   */
  setCategory(i: number) {
    this.selected_category = this.taskService.all_categorys[i]
    this.globalService.open_category = false
    if (this.rotationValueC == 'rotate(0deg)') this.rotationValueC = 'rotate(180deg)'
    else this.rotationValueC = 'rotate(0deg)'
  }


  /**
   * adds a new subtask to the task
   */
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


  /**
   * deletes the selected subtask
   */
  deleteSubtask(i: number) {
    this.delete_index = i
    this.deleted = true
    setTimeout(() => {
      this.subtasks.splice(i, 1)
      this.deleted = false
    }, 400)
  }


  /**
   * opens the input field for editing the subtask
   */
  openEditSubtask(i: number) {
    this.subtasks.forEach((subtask: any) => subtask.selected = false)
    this.subtasks[i].selected = true
    this.edited_subtask_title = this.subtasks[i].title
  }


  /**
   * saves the edited subtask
   */
  saveEditSubtask(i: number) {
    this.subtasks[i].title = this.edited_subtask_title
    this.subtasks[i].selected = false
  }


  /**
   * closes the input field for editing the subtask
   */
  closeEditSubtask(i: number) {
    this.subtasks[i].selected = false
  }


  /**
   * resets the add task menu to the initial value
   */
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
    this.globalService.open_category = false
    this.globalService.open_contacts = false
  }


  /**
   * Checks whether all conditions are met to create a task
   * creates the body for the backend and passes it on to it. It is then forwarded to the board
   */
  async createTask() {
    if (this.task_title.length === 0) this.title_error = true
    if (this.selected_category.length === 0) this.category_error = true
    if (this.selected_category.length === 0 || this.task_title.length == 0) return
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
    await this.taskService.addTask(body)
    if (this.taskService.request_successful) {
      this.clearAll()
      setTimeout(() => {
        this.router.navigateByUrl('/main/board')
        this.globalService.open_add_task = false
      }, 2000)
    }
  }


  /**
   * removes the error messages
   */
  removeError(error: string) {
    if (error == 'title') this.title_error = false
    if (error == 'category') this.category_error = false
  }


  getTooltip(): string {
    if (this.task_title.length == 0 || this.selected_category.length == 0) return 'Title and category are required!'
    else return ''
  }
}

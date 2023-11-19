import { Component, HostListener, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { UserService } from '../user.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { GlobalFunctionsService } from '../global-functions.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass']
})
export class BoardComponent implements OnInit {

  task_search_value: string = ''
  subtask_progress: string = ''
  filtered_users: any = []
  drag_start: boolean = false
  detail_task: any = []
  checkBox_value: boolean = false
  rotationValue: string = 'rotate(0deg)'
  search_value: string = ''
  selected_user_emails: any = []
  contact_selection_list: any = []
  subtask_title: string = ''
  edited_subtask_title: string = ''
  deleted: boolean = false
  delete_index!: number
  edit_task_title: string = ''
  edit_task_description: string = ''
  edit_task_due_date: string = ''
  edit_task_prio: string = ''
  edit_subtasks: any = []
  task_status_changed: boolean = false
  selected_contacts: any = []
  screen_width: number = 0




  constructor(
    public taskService: TaskService,
    public userService: UserService,
    public globalService: GlobalFunctionsService,
    private router: Router,
  ) {

  }


  async ngOnInit() {
    this.screen_width = window.innerWidth
    this.taskService.getTasks().subscribe(async (tasks) => {
      await this.taskService.getAllTasks()
      this.taskService.filterTaskbyStatus()
    });
    await this.taskService.getAllTasks()
    this.taskService.filterTaskbyStatus()
    console.log(this.taskService.all_tasks);
    
  }


/**
 * checks whether and how many subtasks have been completed
 * @param true or false
 * @returns how many of the subtasks have been completed
 */
  getSubtaskProgress(i: number, status: string) {
    let array = this.getArray(status)
    let dones: any[] = []
    let dones_true = []
    array[i].subtasks.forEach((subtask: any) => dones.push(subtask.done));
    dones_true = dones.filter((done: any) => done === true)
    return dones_true.length
  }


  /**
   * calculates the subtasks completed in percent
   * @param true or false 
   * @returns Subtasks completed in percent
   */
  getSubtaskProgressPercent(i: number, status: string) {
    let array = this.getArray(status)
    let dones: any[] = []
    let dones_true = []
    array[i].subtasks.forEach((subtask: any) => dones.push(subtask.done));
    dones_true = dones.filter((done: any) => done === true)
    if (dones.length > 0) return dones_true.length * 100 / array[i].subtasks.length + '%';
    else return 0
  }


  /**
   * determines the assigned contacts based on the emails
   * @param todo, progress, await or done 
   * @returns assigned contacts
   */
  getAssignendContacts(i: number, status: string) {
    let array = this.getArray(status);
    let assignend_contacts: any = [];
    let contact_emails = array[i].assigned_emails
    contact_emails.forEach((email: any) => {
      let contact = this.userService.all_users.find((contact: any) => contact.email === email);
      if (contact) assignend_contacts.push(contact);
    });
    return assignend_contacts;
  }


  /**
   * 
   * @param todo, progress, await, detail or done  
   * @returns Depending on the task status entered, the associated array
   */
  getArray(status: string) {
    if (status == 'detail') return this.detail_task
    if (status == 'todo') return this.taskService.task_status_todo
    if (status == 'progress') return this.taskService.task_status_in_progress
    if (status == 'await') return this.taskService.task_status_await
    if (status == 'done') return [...this.taskService.task_status_done]
  }


  /**
   * fills the array with the assigned contacts based on the emails
   */
  getContactsForEditView() {
    let edit_contacts = [...this.userService.all_users]
    edit_contacts.forEach((user: { [x: string]: any; email: any; }) => {
      user['selected'] = this.detail_task[0].assigned_emails.includes(user.email);
      if (user['selected'] === true) this.selected_contacts.push(user)
    });
    this.contact_selection_list = edit_contacts;
  }


  /**
   * adds the email of the assigned contact to an array. If this already exists, it will be removed again
   */
  selectContact(email: string, i: number) {
    this.updateSelectedContacts(email)
    let contact_selected = this.contact_selection_list[i].selected
    if (contact_selected) {
      this.contact_selection_list[i].selected = false
      let list_index = this.selected_user_emails.findIndex((mail: string) => mail === email);
      this.selected_user_emails.splice(list_index, 1);
    }
    else {
      this.contact_selection_list[i].selected = true
      this.selected_user_emails.push(email);
    }
  }


  /**
   * Adds the selected users to the visual display array or removes them if they already exist
   */
  updateSelectedContacts(email: string) {
    let user_index = this.userService.all_users.findIndex((user: { email: string; }) => user.email === email);
    let index = this.selected_contacts.findIndex((contact: any) => contact.email === email)
    console.log(index)
    if (index != -1) this.selected_contacts.splice(index, 1)
    else this.selected_contacts.push(this.userService.all_users[user_index])
  }


/**
 * 
 * @param todo, progress, await or done  
 * @returns How many contacts are assigned as a number
 */
  getNumberOfContacts(i: number, status: string) {
    let array = this.getArray(status)
    let number = array[i].assigned_emails.length
    return number - 2
  }


  /**
   * four moves the selected task into the corresponding array in which the task was stored
   * The task status is then passed on to the backend and saved
   * 
   * @param event div container is stored
   * @param status todo, progress, await or done  
   */
  onItemDrop(event: CdkDragDrop<any>, status: string) {
    if (event.previousContainer === event.container) moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data[event.currentIndex].status = status;
      let body = {
        id: event.container.data[event.currentIndex].id,
        status: status,
      }
      this.taskService.updateTask(body)
      this.task_status_changed = true
      setTimeout(() => this.task_status_changed = false, 2000)
    }
  }


  onDragEnded(event: CdkDragEnd) {
    this.drag_start = false;
  }


  onDragStarted(event: CdkDragStart) {
    this.drag_start = true
  }


  /**
   *  Opens the task menu section and fills the variables with the data of the selected task
   * @param status todo, progress, await or done  
   */
  openTaskDetail(i: number, status: string) {
    this.selected_contacts = []
    this.detail_task[0] = []
    let array = [...this.getArray(status)]
    this.detail_task[0] = array[i]
    this.detail_task[0].array_index = i
    this.globalService.open_task_details = true
    this.edit_task_title = this.detail_task[0].title;
    this.edit_task_description = this.detail_task[0].description;
    this.edit_task_due_date = this.detail_task[0].due_date
  }


  /**
   * Opens the menu for editing the task
   */
  openEditTask() {
    this.edit_subtasks = []
    this.globalService.open_edit_task = true
    this.selected_user_emails = [...this.detail_task[0].assigned_emails]
    this.edit_subtasks = structuredClone(this.detail_task[0].subtasks)
    this.getContactsForEditView()
  }


  /**
   * closes the task menu section
   */
  closeTaskDetails() {
    this.globalService.animation = true
    setTimeout(() => this.globalService.open_task_details = false, 500);
    setTimeout(() => this.globalService.animation = false, 600);
  }


  /**
   * closes the edit task menu section
   */
  backToTaskDetails() {
    this.globalService.open_edit_task = false
  }


  /**
   * sets the priority in the edit task menu
   * @param prio urgent, medium or low
   */
  setPrio(prio: string) {
    this.edit_task_prio = prio
  }


  /**
   * close and open the drop down menu and adjust the direction of the arrows
   */
  toggleDropDownMenu() {
    this.globalService.open_dropdown = !this.globalService.open_dropdown;
    if (this.globalService.open_dropdown) this.search_value = ''
    if (this.rotationValue == 'rotate(0deg)') this.rotationValue = 'rotate(180deg)'
    else this.rotationValue = 'rotate(0deg)'
  }


  /**
   * close and open the drop down menu and adjust the direction of the arrows
   * @param value search text
   */
  async handleValueChangeOnSearch(value: any, object: string) {
    if (object == 'contact') {
      this.contact_selection_list = this.userService.all_users.filter((user: { user_name: string }) =>
        user.user_name.toLowerCase().includes(this.search_value.toLowerCase())
      );
    }
    if (object == 'task') {
      this.taskService.all_tasks = this.taskService.all_tasks.filter((task: any) =>
        task.title.toLowerCase().includes(this.task_search_value.toLowerCase())
      );
      if (this.task_search_value.length == 0) await this.taskService.getAllTasks()
      this.taskService.filterTaskbyStatus()
    }
  }


/**
 * sets the subtask status using a checkbox
 */
  updateSubtaskStatus(event: any, i: number) {
    let value = this.edit_subtasks[i].done
    if (value) this.edit_subtasks[i].done = false
    else this.edit_subtasks[i].done = true
  }


  /**
   * adds a subtask to the task
   */
  addSubtask() {
    if (this.subtask_title.length > 0) {
      let subtask = {
        title: this.subtask_title,
        done: false
      }
      this.edit_subtasks.push(subtask)
      this.subtask_title = ''
    }
  }


  /**
   * deletes the subtask
   */
  deleteSubtask(i: number) {
    this.delete_index = i
    this.deleted = true
    setTimeout(() => {
      this.edit_subtasks.splice(i, 1)
      this.deleted = false
    }, 400)
  }


  /**
   * 
   */
  closeEditSubtask(i: number) {
    this.edit_subtasks[i].selected = false
  }


  /**
   * closes the input field for editing the subtask
   */
  openEditSubtask(i: number) {
    this.edit_subtasks.forEach((subtask: any) => subtask.selected = false)
    this.edit_subtasks[i].selected = true
    this.edited_subtask_title = this.edit_subtasks[i].title
  }


  /**
   * saves the edited suibtask
   */
  saveEditSubtask(i: number) {
    this.edit_subtasks[i].title = this.edited_subtask_title
    this.edit_subtasks[i].selected = false
  }


  /**
   * creates the body for the backend and forwards it to it and closes the open input fields for editing the subtask
   */
  async updateEditTask() {
    this.edit_subtasks.forEach((subtask: any) => subtask.selected = false)
    let body = {
      assigned_emails: this.selected_user_emails,
      title: this.edit_task_title,
      description: this.edit_task_description,
      due_date: this.edit_task_due_date,
      prio: this.edit_task_prio,
      subtasks: this.edit_subtasks,
      id: this.detail_task[0].id
    }
    await this.taskService.updateTask(body)
    if (this.taskService.request_successful) {
      this.globalService.open_dropdown = false
      setTimeout(() => {
        this.globalService.open_edit_task = false
        this.globalService.open_task_details = false
      }, 2000)
    }
  }


  /**
   * opens the add task menu
   */
  openAddContact() {
    this.userService.user_name = ''
    this.userService.user_email = ''
    this.userService.user_phone = ''
    this.userService.open_add_user = true
  }


  /**
   * determines the task to be deleted and forwards it to the backend where it is deleted
   * @param id task-id
   * @param status todo, progress, await or done  
   */
  async deleteTask(id: string, status: string) {
    let array = this.getArray(status)
    let index = this.detail_task[0].array_index
    array.splice(index, 1)
    await this.taskService.deleteTask(id)
    if (this.taskService.request_successful) {
      this.deleted = true
      setTimeout(() => {
        this.globalService.open_task_details = false
        this.deleted = false
      }, 2000)
    }
  }


  /**
   * Empties the input field for searching
   */
  async clearSearchInputField() {
    this.task_search_value = ''
    await this.taskService.getAllTasks()
    this.taskService.filterTaskbyStatus()
  }


  /**
   * closes the add task menu
   */
  closeAddTaskPopUp() {
    this.globalService.open_category = false
    this.globalService.open_contacts = false
    this.globalService.animation = true
    setTimeout(() => this.globalService.open_add_task = false, 500);
    setTimeout(() => this.globalService.animation = false, 600);
  }


  /**
   * opens the add task menu. If the width is less than 600 pixels, it is forwarded to the add task component
   * @param status todo, progress, await or done  
   */
  openAddTask(status: string) {
    if (this.screen_width < 600) {
      this.router.navigateByUrl('main/add_task_board')
      setTimeout(() => this.taskService.task_status = status, 200)
    }
    else {
      setTimeout(() => this.taskService.task_status = status, 200)
      this.globalService.open_add_task = true
    }
  }


  /**
   * Determines the screen width when changing the window
   * @param event window resize
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screen_width = window.innerWidth;
  }
}




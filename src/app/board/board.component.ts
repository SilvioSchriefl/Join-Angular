import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { TaskService } from '../task.service';
import { UserService } from '../user.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
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
  open_dropdown: boolean = false
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
  }






  getSubtaskProgress(i: number, status: string) {
    let array = this.getArray(status)
    let dones: any[] = []
    let dones_true = []
    array[i].subtasks.forEach((subtask: any) => dones.push(subtask.done));
    dones_true = dones.filter((done: any) => done === true)
    return dones_true.length
  }


  getSubtaskProgressPercent(i: number, status: string) {
    let array = this.getArray(status)
    let dones: any[] = []
    let dones_true = []
    array[i].subtasks.forEach((subtask: any) => dones.push(subtask.done));
    dones_true = dones.filter((done: any) => done === true)
    if (dones.length > 0) return dones_true.length * 100 / array[i].subtasks.length + '%';
    else return 0
  }


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


  getArray(status: string) {
    if (status == 'detail') return this.detail_task
    if (status == 'todo') return this.taskService.task_status_todo
    if (status == 'progress') return this.taskService.task_status_in_progress
    if (status == 'await') return this.taskService.task_status_await
    if (status == 'done') return [...this.taskService.task_status_done]
  }


  getContactsForEditView() {
    let edit_contacts = [...this.userService.all_users]
    edit_contacts.forEach((user: { [x: string]: any; email: any; }) => {
      user['selected'] = this.detail_task[0].assigned_emails.includes(user.email);
      if (user['selected'] === true) this.selected_contacts.push(user)
    });
    this.contact_selection_list = edit_contacts;
  }


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


  updateSelectedContacts(email: string) {
    let user_index = this.userService.all_users.findIndex((user: { email: string; }) => user.email === email);
    let index = this.selected_contacts.findIndex((contact: any) => contact.email === email)
    console.log(index)
    if (index != -1) this.selected_contacts.splice(index, 1)
    else this.selected_contacts.push(this.userService.all_users[user_index])
  }



  getNumberOfContacts(i: number, status: string) {
    let array = this.getArray(status)
    let number = array[i].assigned_emails.length
    return number - 2
  }


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


  openTaskDetail(i: number, status: string) {
    this.detail_task[0] = []
    let array = [...this.getArray(status)]
    this.detail_task[0] = array[i]
    this.detail_task[0].array_index = i
    this.globalService.open_task_details = true
    this.edit_task_title = this.detail_task[0].title;
    this.edit_task_description = this.detail_task[0].description;
    this.edit_task_due_date = this.detail_task[0].due_date
  }


  openEditTask() {
    this.edit_subtasks = []
    this.globalService.open_edit_task = true
    this.selected_user_emails = [...this.detail_task[0].assigned_emails]
    this.edit_subtasks = structuredClone(this.detail_task[0].subtasks)
    this.getContactsForEditView()
  }


  closeTaskDetails() {
    this.globalService.animation = true
    setTimeout(() => this.globalService.open_task_details = false, 500);
    setTimeout(() => this.globalService.animation = false, 600);
  }


  openContact() {

  }


  backToTaskDetails() {
    this.globalService.open_edit_task = false
  }


  setPrio(prio: string) {
    this.edit_task_prio = prio
  }


  toggleDropDownMenu() {
    this.open_dropdown = !this.open_dropdown;
    if (this.open_dropdown) this.search_value = ''
    if (this.rotationValue == 'rotate(0deg)') this.rotationValue = 'rotate(180deg)'
    else this.rotationValue = 'rotate(0deg)'
  }


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


  updateSubtaskStatus(event: any, i: number) {
    let value = this.edit_subtasks[i].done
    if (value) this.edit_subtasks[i].done = false
    else this.edit_subtasks[i].done = true
    console.log(this.taskService.task_status_done)
  }


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


  deleteSubtask(i: number) {
    this.delete_index = i
    this.deleted = true
    setTimeout(() => {
      this.edit_subtasks.splice(i, 1)
      this.deleted = false
    }, 400)
  }


  detailTaskContactList() {

  }


  closeEditSubtask(i: number) {
    this.edit_subtasks[i].selected = false
  }


  openEditSubtask(i: number) {
    this.edit_subtasks.forEach((subtask: any) => subtask.selected = false)
    this.edit_subtasks[i].selected = true
    this.edited_subtask_title = this.edit_subtasks[i].title
  }


  saveEditSubtask(i: number) {
    this.edit_subtasks[i].title = this.edited_subtask_title
    this.edit_subtasks[i].selected = false
  }


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
      setTimeout(() => {
        this.globalService.open_edit_task = false
        this.globalService.open_task_details = false
      }, 2000)
    }
  }


  openAddContact() {
    this.userService.user_name = ''
    this.userService.user_email = ''
    this.userService.user_phone = ''
    this.userService.open_add_user = true
  }


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


  async clearSearchInputField() {
    this.task_search_value = ''
    await this.taskService.getAllTasks()
    this.taskService.filterTaskbyStatus()
  }

  toggleAddTaskPopUp(status: string) {
    this.globalService.animation = true
    setTimeout(() => this.globalService.open_add_task = false, 500);
    setTimeout(() => this.globalService.animation = false, 600);
  }


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


  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.screen_width = window.innerWidth;
  }
}




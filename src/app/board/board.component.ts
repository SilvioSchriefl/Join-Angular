import { Component, OnInit } from '@angular/core';
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
  task_status_in_progress: any = []
  task_status_todo: any = []
  task_status_done: any = []
  task_status_await: any = []
  subtask_progress: string = ''
  filtered_users: any = []
  drag_start: boolean = false
  detail_task: any = []
  checkBox_value: boolean = false
  open_dropdown: boolean = false
  rotationValue: string = 'rotate(0deg)'
  search_value: string = ''
  selected_user_emails: any = []
  selected_users_list: any = []
  subtask_title: string = ''
  edited_subtask_title: string = ''
  deleted: boolean = false
  delete_index!: number




  constructor(
    public taskService: TaskService,
    public userService: UserService,
    public globalService: GlobalFunctionsService,
    private router: Router,
  ) {

  }


  async ngOnInit() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.filterTaskbyStatus()
    });
    await this.taskService.getAllTasks()
    await this.userService.getUsersAndContacts()
    this.filterTaskbyStatus()
  }


  filterTaskbyStatus() {
    this.task_status_todo = this.taskService.all_tasks.filter((task: any) => task.status === 'todo')
    this.task_status_in_progress = this.taskService.all_tasks.filter((task: any) => task.status === 'progress')
    this.task_status_await = this.taskService.all_tasks.filter((task: any) => task.status === 'await')
    this.task_status_done = this.taskService.all_tasks.filter((task: any) => task.status === 'done')
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
    let array = this.getArray(status)
    let assignend_contacts: any = [];
    let contact_emails = array[i].assigned_emails;
    contact_emails.forEach((email: any) => {
      let contact = this.userService.all_users.find((contact: any) => contact.email === email);
      if (contact) assignend_contacts.push(contact);
    });
    return assignend_contacts;
  }


  getContactsForEditView() {
    let edit_contacts = this.userService.all_users
    edit_contacts.forEach((user: { [x: string]: any; email: any; }) => {
      user['selected'] = this.detail_task[0].assigned_emails.includes(user.email);
    });
    this.selected_users_list = edit_contacts;
  }


  selectContact(email: string, i: number) {
    let contact_selected = this.selected_users_list[i].selected
    if (contact_selected) {
      this.selected_users_list[i].selected = false
      let index = this.selected_user_emails.findIndex((mail: string) => mail === email);
      this.selected_user_emails.splice(index, 1);
    }
    else {
      this.selected_users_list[i].selected = true
      this.selected_user_emails.push(email);
    }
  }


  getNumberOfContacts(i: number, status: string) {
    let array = this.getArray(status)
    let number = array[i].assigned_emails.length
    return number - 2
  }


  onItemDrop(event: CdkDragDrop<any>, status: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
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
    }
  }


  getArray(status: string) {
    if (status == 'detail') return this.detail_task
    if (status == 'todo') return this.task_status_todo
    if (status == 'progress') return this.task_status_in_progress
    if (status == 'await') return this.task_status_await
    if (status == 'done') return this.task_status_done
  }


  onDragEnded(event: CdkDragEnd) {
    this.drag_start = false;
  }


  onDragStarted(event: CdkDragStart) {
    this.drag_start = true
  }


  openTaskDetail(i: number, status: string) {
    let array = this.getArray(status)
    this.detail_task[0] = array[i]
    this.detail_task[0].array_index = i
    this.globalService.open_task_details = true
    console.log(this.detail_task);
  }


  closeTaskDetails() {
    this.globalService.open_task_details = false
  }


  openContact() {

  }


  updateSubtaskStatus(event: any, i: number) {
    let value = this.detail_task[0].subtasks[i].done
    if (value) this.detail_task[0].subtasks[i].done = false
    else this.detail_task[0].subtasks[i].done = true
  }


  openEditTask() {

    this.globalService.open_edit_task = true
    this.selected_user_emails = this.detail_task[0].assigned_emails
    this.getContactsForEditView()
  }


  backToTaskDetails() {

    this.globalService.open_edit_task = false
  }


  setPrio(prio: string) {
    this.detail_task[0].prio = prio
  }


  toggleDropDownMenu() {
    this.open_dropdown = !this.open_dropdown;
    if (this.open_dropdown) this.search_value = ''
    else this.getContactsForEditView()
    if (this.rotationValue == 'rotate(0deg)') this.rotationValue = 'rotate(180deg)'
    else this.rotationValue = 'rotate(0deg)'
  }


  async handleValueChangeOnSearch(value: any, object: string) {
    if (object == 'contact') {
      this.selected_users_list = this.userService.all_users.filter((user: { user_name: string }) =>
        user.user_name.toLowerCase().includes(this.search_value.toLowerCase())
      );
    }
    if (object == 'task') {
      this.taskService.all_tasks = this.taskService.all_tasks.filter((task: any) =>
        task.title.toLowerCase().includes(this.task_search_value.toLowerCase())
      );
      if (this.task_search_value.length == 0) await this.taskService.getAllTasks()
      this.filterTaskbyStatus()
    }

  }


  addSubtask() {
    if (this.subtask_title.length > 0) {
      let subtask = {
        title: this.subtask_title,
        done: false
      }
      this.detail_task[0].subtasks.push(subtask)
      this.subtask_title = ''
    }
  }


  deleteSubtask(i: number) {
    this.delete_index = i
    this.deleted = true
    setTimeout(() => {
      this.detail_task[0].subtasks.splice(i, 1)
      this.deleted = false
    }, 200)

  }


  detailTaskContactList() {

  }


  closeEditSubtask(i: number) {
    this.detail_task[0].subtasks[i].selected = false
  }


  openEditSubtask(i: number) {
    this.detail_task[0].subtasks[i].selected = true
    this.edited_subtask_title = this.detail_task[0].subtasks[i].title
  }


  saveEditSubtask(i: number) {
    this.detail_task[0].subtasks[i].title = this.edited_subtask_title
    this.detail_task[0].subtasks[i].selected = false
  }


  async updateEditTask() {
    let body = {
      assigned_emails: this.selected_user_emails,
      title: this.detail_task[0].title,
      description: this.detail_task[0].description,
      due_date: this.detail_task[0].due_date,
      prio: this.detail_task[0].prio,
      subtasks: this.detail_task[0].subtasks,
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
    this.filterTaskbyStatus()
  }

  toggleAddTaskPopUp(status: string) {
    setTimeout(() => this.taskService.task_status = status, 200)
    this.globalService.open_add_task = !this.globalService.open_add_task
  }
}



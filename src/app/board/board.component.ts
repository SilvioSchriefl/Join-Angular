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

  search_text: string = ''
  task_status_in_progress: any = []
  task_status_todo: any = []
  task_status_done: any = []
  task_status_await: any = []
  subtask_progress: string = ''
  filtered_users: any = []
  drag_start: boolean = false
  detail_task: any = []
  checkBox_value: boolean = false
  open_edit_task: boolean = false
  open_dropdown: boolean = false
  rotationValue: string = 'rotate(0deg)'
  search_value: string = ''
  selected_user_emails: any = []
  selected_users_list: any = []
  subtask_title: string = ''
  edited_subtask_title: string = ''




  constructor(
    public taskService: TaskService,
    public userService: UserService,
    public globalService: GlobalFunctionsService,
    private router: Router,
  ) {

  }


  async ngOnInit() {
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
    let progress_in_percent
    let dones: any[] = []
    let dones_true = []
    array[i].subtasks.forEach((subtask: any) => dones.push(subtask.done));
    dones_true = dones.filter((done: any) => done === true)
    progress_in_percent = dones_true.length * 100 / array[i].subtasks.length + '%';
    return progress_in_percent
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
    let body = {
      id: this.detail_task[0].id,
      subtasks: this.detail_task[0].subtasks
    }
    this.taskService.updateTask(body)
  }


  openEditTask() {
    this.globalService.open_task_details = false
    this.open_edit_task = true
    this.selected_user_emails = this.detail_task[0].assigned_emails
    this.getContactsForEditView()
  }


  backToTaskDetails() {
    this.globalService.open_task_details = true
    this.open_edit_task = false
  }


  setPrio(prio: string) {

  }


  toggleDropDownMenu() {
    this.open_dropdown = !this.open_dropdown;
    if (this.open_dropdown) this.search_value = ''
    else this.getContactsForEditView()
    if (this.rotationValue == 'rotate(0deg)') this.rotationValue = 'rotate(180deg)'
    else this.rotationValue = 'rotate(0deg)'
  }


  handleValueChangeOnSearch(value: any) {
    this.selected_users_list = this.userService.all_users.filter((user: { user_name: string }) =>
      user.user_name.toLowerCase().includes(this.search_value.toLowerCase())
    );
  }


  addSubtask() {
    if (this.subtask_title.length > 0) {
      let subtask = {
        title: this.subtask_title,
        done: false
      }
      //this.subtasks.push(subtask)
      this.subtask_title = ''
    }
  }


  deleteSubtask(i: number) {
    //this.subtasks.splice(i, 1)
  }


  detailTaskContactList() {

  }


  openEditSubtask(i: number) {
    //this.subtasks[i].selected = true
    //this.edited_subtask_title = this.subtasks[i].title
  }


  saveEditSubtask(i: number) {
    //this.subtasks[i].title = this.edited_subtask_title
    //this.subtasks[i].selected = false
  }

}



import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { UserService } from '../user.service';

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

  constructor(
    public taskService: TaskService,
    public userService: UserService
  ) {

  }


  async ngOnInit() {
    await this.taskService.getAllTasks()
    await this.userService.getUsersAndContacts()
    this.filterTaskbyStatus()
    console.log(this.taskService.all_tasks);

  }


  filterTaskbyStatus() {
    this.task_status_todo = this.taskService.all_tasks.filter((task: any) => task.status === 'todo')
    this.task_status_in_progress = this.taskService.all_tasks.filter((task: any) => task.status === 'progress')
    this.task_status_await = this.taskService.all_tasks.filter((task: any) => task.status === 'await')
    this.task_status_done = this.taskService.all_tasks.filter((task: any) => task.status === 'done')
    console.log(this.task_status_todo);
  }

  getSubtaskProgress(i: number) {
    let dones: any[] = []
    let dones_true = []
    this.task_status_todo[i].subtasks.forEach((subtask: any) => dones.push(subtask.done));
    dones_true = dones.filter((done: any) => done === true)
    return dones_true.length
  }


  getSubtaskProgressPercent(i: number) {
    let progress_in_percent
    let dones: any[] = []
    let dones_true = []
    this.task_status_todo[i].subtasks.forEach((subtask: any) => dones.push(subtask.done));
    dones_true = dones.filter((done: any) => done === true)
    progress_in_percent = dones_true.length * 100 / this.task_status_todo[i].subtasks.length + '%';
    return progress_in_percent
  }


  getAssignendContacts(i: number) {
    let registerd_users = this.userService.all_users.filter((user: any) => user.user_contact  === false);
    let assignend_contacts: any[] = [];
    let contact_ids = this.taskService.all_tasks[i].contacts;
    let user_ids = this.taskService.all_tasks[i].custom_users;

    contact_ids.forEach((id: any) => {
        let contact = this.userService.all_contacts.find((contact: any) => +contact.id === id);
        assignend_contacts.push(contact);
    });

    user_ids.forEach((id: any) => {
        let contact = registerd_users.find((contact: any) => +contact.id === id);
        assignend_contacts.push(contact);
    });

    console.log(assignend_contacts);
    return assignend_contacts;
  }
}


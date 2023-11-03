import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { UserService } from '../user.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { GlobalFunctionsService } from '../global-functions.service';


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
  all_board_tasks = []
  drag_start: boolean = false
  detail_index: number = 0
  detail_array: any[] = []
 

  constructor(
    public taskService: TaskService,
    public userService: UserService,
    public globalService: GlobalFunctionsService
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


  getSubtaskProgress(i: number, status: string) {
    let array = this.getArray(status)
    let dones: any[] = []
    let dones_true = []
    array[i].subtasks.forEach((subtask: any) => dones.push(subtask.done));
    dones_true = dones.filter((done: any) => done === true)
    return dones_true.length
  }


  getSubtaskProgressPercent(i: number, status:string) {
    let array = this.getArray(status)
    let progress_in_percent
    let dones: any[] = []
    let dones_true = []
    array[i].subtasks.forEach((subtask: any) => dones.push(subtask.done));
    dones_true = dones.filter((done: any) => done === true)
    progress_in_percent = dones_true.length * 100 / array[i].subtasks.length + '%';
    return progress_in_percent
  }


  getAssignendContacts(i: number, status:string) {
    let array = this.getArray(status)
    let registerd_users = this.userService.all_users.filter((user: any) => user.user_contact  === false);
    let assignend_contacts: any[] = [];
    let contact_ids = array[i].contacts;
    let user_ids = array[i].custom_users;

    contact_ids.forEach((id: any) => {
        let contact = this.userService.all_contacts.find((contact: any) => +contact.id === id);
        assignend_contacts.push(contact);
    });
    user_ids.forEach((id: any) => {
        let contact = registerd_users.find((contact: any) => +contact.id === id);
        assignend_contacts.push(contact);
    });
    return assignend_contacts;
  }


  getNumberOfContacts(i:number, status:string){
    let array = this.getArray(status)
    let a = array[i].custom_users.length
    let b = array[i].contacts.length
    return a + b - 2
  }


  onDrop(event:any) {
    console.log('abgelegt');
    
  }

  onItemDrop(event: CdkDragDrop<any>, status:string) {
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
      this.taskService.updateTask(event.container.data[event.currentIndex].id, status)
    }
  }


  getArray(status:string) {
    if (status == 'todo')  return this.task_status_todo
    if (status == 'progress')  return this.task_status_in_progress
    if (status == 'await') return this.task_status_await
    if (status == 'done')  return this.task_status_done
  }


  onDragEnded(event: CdkDragEnd) {
    this.drag_start = false;
  }


  onDragStarted(event: CdkDragStart) {
  this.drag_start = true
  }


  openTaskDetail(i:number, status:string){
    this.detail_index = i
    this.detail_array = this.getArray(status)
    this.globalService.open_task_details = true
  }
}



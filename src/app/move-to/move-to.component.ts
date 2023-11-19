import { Component, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFunctionsService } from '../global-functions.service';
import { TaskService } from '../task.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-move-to',
  templateUrl: './move-to.component.html',
  styleUrls: ['./move-to.component.sass']
})
export class MoveToComponent {

  animation: boolean = false;
  open_move_to_menu = false;
  @Input() task_index: number = 0;
  @Input() status: string = ''


  constructor(
    public taskService: TaskService,
    public userService: UserService,
    public globalService: GlobalFunctionsService,
  ) {

  }


  /**
   * changes the task status and saves it in the backend
   * @param status todo, progress, await or done
   */
  setTaskstatus(status: string) {
    let array = this.getArray(this.status);
    this.open_move_to_menu = false;
    let body = {
      id: array[this.task_index].id,
      status: status,
    }
    this.taskService.updateTask(body)
  }


  /**
   * opens the move to menu
   */
  openMoveToMenu() {
    this.open_move_to_menu = true;
  }


  /**
   * 
   * @param todo, progress, await, detail or done  
   * @returns Depending on the task status entered, the associated array
   */
  getArray(status: string) {
    if (status == 'todo') return this.taskService.task_status_todo
    if (status == 'progress') return this.taskService.task_status_in_progress
    if (status == 'await') return this.taskService.task_status_await
    if (status == 'done') return [...this.taskService.task_status_done]
  }


  /**
   * close the move to menu
   */
  closeMoveToMenu() {
    this.animation = true
    setTimeout(() => this.animation = false, 500);
    setTimeout(() => this.open_move_to_menu = false, 600);
  }


  /**
   * closes the move to menu when clicked outside the menu
   */
  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (this.open_move_to_menu) {
      this.animation = true
      setTimeout(() => this.animation = false, 500);
      setTimeout(() => this.open_move_to_menu = false, 600);
    }
  }
}

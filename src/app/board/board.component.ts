import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.sass']
})
export class BoardComponent implements OnInit{

  search_text: string = ''
  task_status_in_progress:any = []
  task_status_todo:any = []
  task_status_done:any = []
  task_status_await:any = []

  constructor(
    public taskService: TaskService
  ) {

  }


  async ngOnInit() {
    await this.taskService.getAllTasks()

    console.log(this.taskService.all_tasks);
    
  }


  filterTaskbyStatus() {
    this.task_status_todo = this.taskService.all_tasks.filter((task: any) => task.status === 'todo')
    this.task_status_todo = this.taskService.all_tasks.filter((task: any) => task.status === 'todo')
    this.task_status_todo = this.taskService.all_tasks.filter((task: any) => task.status === 'todo')
  }

}

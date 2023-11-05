import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.sass']
})
export class SummaryComponent implements OnInit {

  greeting: string = ''
  urgent_count!: number
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dead_line:string = ''


  constructor(
    public userService: UserService,
    public taskService: TaskService,
    private router: Router,
  ) { }


  async ngOnInit() {
    this.setGreeting();
    await this.taskService.getAllTasks()
    this.taskService.filterTaskbyStatus()
    await this.getTasksUrgent()
    await this.userService.getUsersAndContacts()
    this.getDeadline()
  }

  setGreeting() {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      this.greeting = 'Good morning';
    } else if (currentTime < 18) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Guten Abend';
    }
  }


  async getTasksUrgent() {
    console.log(this.taskService.all_tasks[0].due_date)
    let urgent_count = []
    urgent_count = this.taskService.all_tasks.filter((task: { prio: string; }) => task.prio === 'urgent')
    this.urgent_count = urgent_count.length
  }


  getDeadline() {
    let dates: any = []
    this.taskService.all_tasks.forEach((task: any) => dates.push(task.due_date))
    const currentDate: any = new Date(); 
    let nearestFutureDate = null;
    let minTimeDifference = Infinity;
    for (const dateStr of dates) {
      const date: any = new Date(dateStr);
      const timeDifference = date - currentDate;
      if (timeDifference > 0 && timeDifference < minTimeDifference) {
        nearestFutureDate = date;
        minTimeDifference = timeDifference;
      }
    }
    if (nearestFutureDate) {
      const month = this.months[nearestFutureDate.getMonth()];
      const day = nearestFutureDate.getDate();
      const year = nearestFutureDate.getFullYear();
      this.dead_line =  month +' ' + day + ', ' + year
    } else this.dead_line = 'No upcoming deadline'
  }


  openBoard() {
    this.router.navigateByUrl('/main/board')
  }
}

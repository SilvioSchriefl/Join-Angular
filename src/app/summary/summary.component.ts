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


  /**
   * collects various data
   */
  async ngOnInit() {
    this.setGreeting();
    await this.taskService.getAllTasks()
     this.taskService.filterTaskbyStatus()
    await this.getTasksUrgent()
    await this.userService.getUsersAndContacts()
    await this.getDeadline()
  }


  /**
   * gives the appropriate greeting
   */
  setGreeting() {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      this.greeting = 'Good morning';
    } else if (currentTime < 18) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }


  /**
   * determines all urgent tasks
   */
  async getTasksUrgent() {
    let urgent_count = []
    urgent_count = this.taskService.all_tasks.filter((task: { prio: string; }) => task.prio === 'urgent')
    this.urgent_count = urgent_count.length
  }


  /**
   * determines the closest deadline
   */
  async getDeadline() {
    let dates: any = []
    this.taskService.all_tasks.forEach((task: any) => dates.push(task.due_date))
    const currentDate: any = new Date(); 
    let nearestFutureDate = null;
    let minTimeDifference = Infinity;
    for (const dateStr of dates) {
      const date: any = new Date(dateStr);   
      const timeDifference = date - currentDate
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


  /**
   * forwards to board
   */
  openBoard() {
    this.router.navigateByUrl('/main/board')
  }
}

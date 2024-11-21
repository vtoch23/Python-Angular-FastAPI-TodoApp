import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule, 
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'My Todo App';
  tasks: any = [];
  newTask = "";

  APIURL = "http://localhost:8000/";

  constructor(private http: HttpClient){}

  ngOnInit(){
    this.get_tasks();
  }

  get_tasks() {
    this.http.get(this.APIURL+"get_tasks").subscribe((res) => {
      this.tasks=res;
    })
  }

  add_task() {
    let body = new FormData();
    if (this.newTask) {
      body.append('task', this.newTask);
      this.http.post(this.APIURL+"add_task", body).subscribe((res) => {
        this.newTask = "";
        this.get_tasks();
      })
    }
    else {
      alert('Please enter a task')
    }
  }

  delete_task(id: any){
    let body = new FormData();
    body.append('id', id);
    this.http.post(this.APIURL+"delete_task", body).subscribe((res) => {
      this.get_tasks();
    })
  }

  delete_all(){
      let body = new FormData();
      body.append('tasks', this.tasks);
      this.http.post(this.APIURL+"delete_all", body).subscribe((res) => {
        this.get_tasks();
      })
  }
}

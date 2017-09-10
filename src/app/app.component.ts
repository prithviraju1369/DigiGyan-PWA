import { Component, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit, OnInit {
  title = 'app works!';
  
  constructor() {
    
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
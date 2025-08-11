import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LogEntry, LogService } from '../../services/log.service';

@Component({
  selector: 'app-log',
  imports: [NgFor],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent implements OnInit {
  logs: LogEntry[] = [];

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.logService.getLogs().subscribe(data => {
      this.logs = data;
    });
  }

}

import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LogEntry, LogService } from '../../services/log.service';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-log',
  imports: [NgIf,MaterialModule,],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent implements OnInit {
  displayedColumns: string[] = ['timestamp', 'level', 'message'];
  dataSource: LogEntry[] = [];
  loading = true;

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.logService.getLogs().subscribe(data => {
      this.dataSource = data;
      this.loading = false;
    });
  }
}

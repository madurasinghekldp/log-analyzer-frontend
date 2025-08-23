import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../material/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { LogEntry, LogStreamService } from '../../services/log-stream.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-log-table',
  imports: [MaterialModule],
  templateUrl: './log-table.component.html',
  styleUrl: './log-table.component.css'
})
export class LogTableComponent implements OnInit,AfterViewInit  {

  displayedColumns: string[] = ['timestamp', 'level', 'message'];
  dataSource = new MatTableDataSource<LogEntry>([]);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private streamService: LogStreamService,private logService: LogService) {}

  ngOnInit() {

    this.logService.getLogs().subscribe(data => {
      this.dataSource.data = data;
    });
    // Start listening to live stream
    this.streamService.stream().subscribe(log => {
      // Append new log to the top (optional)
      const data = this.dataSource.data;
      data.unshift(log);
      // Keep only the last N logs if you want
      if (data.length > 1000) { data.pop(); }
      this.dataSource.data = [...data]; // trigger table update
    });

    // Optional: global filter predicate stays the same as before
    this.dataSource.filterPredicate = (row, filter) =>
      (row.timestamp + ' ' + row.level + ' ' + row.message).toLowerCase()
        .includes(filter.trim().toLowerCase());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  filterByLevel(level: string) {
    this.dataSource.filterPredicate = (data, filter) => {
      return filter === '' || data.level.toLowerCase() === filter.toLowerCase();
    };
    this.dataSource.filter = level;
  }
}

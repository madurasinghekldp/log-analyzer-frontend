import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LogEntry, LogService } from '../../services/log.service';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-log',
  imports: [MaterialModule,],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent implements OnInit {
  displayedColumns: string[] = ['timestamp', 'level', 'message'];
  dataSource = new MatTableDataSource<LogEntry>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.logService.getLogs().subscribe(data => {
      this.dataSource.data = data;
    });

    // Default filter (case-insensitive)
    this.dataSource.filterPredicate = (data, filter) => {
      const dataStr = `${data.timestamp} ${data.level} ${data.message}`.toLowerCase();
      return dataStr.includes(filter);
    };
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

import { Component } from '@angular/core';
import { LogComponent } from './components/log/log.component';
import { LogTableComponent } from './components/log-table/log-table.component';
import { LogChartComponent } from './log-chart/log-chart.component';

@Component({
  selector: 'app-root',
  imports: [LogTableComponent,LogChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'log-analyzer-frontend';
}

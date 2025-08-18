import { Component } from '@angular/core';
import { LogComponent } from './components/log/log.component';
import { LogTableComponent } from './components/log-table/log-table.component';

@Component({
  selector: 'app-root',
  imports: [LogTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'log-analyzer-frontend';
}

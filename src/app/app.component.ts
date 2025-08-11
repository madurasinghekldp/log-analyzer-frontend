import { Component } from '@angular/core';
import { LogComponent } from './components/log/log.component';

@Component({
  selector: 'app-root',
  imports: [LogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'log-analyzer-frontend';
}

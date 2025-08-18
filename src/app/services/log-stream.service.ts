import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class LogStreamService {

  private url = 'http://localhost:8080/api/logs/stream'; // or /logs/stream-cors

  constructor(private zone: NgZone) {}

  stream(): Observable<LogEntry> {
    return new Observable<LogEntry>(observer => {
      const es = new EventSource(this.url);

      es.onmessage = (event) => {
        // SSE delivers data as string; parse JSON
        const data: LogEntry = JSON.parse(event.data);
        // Ensure change detection runs
        this.zone.run(() => observer.next(data));
      };

      es.onerror = () => {
        // auto-reconnect pattern: close & recreate after short delay
        es.close();
        setTimeout(() => {
          this.stream().subscribe(observer); // resubscribe
        }, 2000);
      };

      return () => es.close();
    });
  }
}

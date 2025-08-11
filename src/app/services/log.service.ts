import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
export class LogService {

  private apiUrl = 'http://localhost:8080/api/logs';

  constructor(private http: HttpClient) {}

  getLogs(): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(this.apiUrl);
  }
}

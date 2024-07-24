import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  apiUrl: string = environment.apiUrl;
  apiKey: string = environment.apiKey;

  constructor(private http: HttpClient) {}

  sendMessage(content: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-4',
      messages: [{ role: 'user', content }],
      max_tokens: 1000
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}

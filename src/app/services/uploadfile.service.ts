import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatGptService {
  private apiUrl = 'https://api.openai.com/v1/completions'; // URL của API ChatGPT

  constructor(private http: HttpClient) { }

  getSummary(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = {
      'Authorization': `Bearer YOUR_API_KEY`, // Thay thế YOUR_API_KEY bằng khóa API của bạn
      'Content-Type': 'multipart/form-data'
    };

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }
}

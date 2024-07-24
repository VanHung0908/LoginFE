import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment'; // import environment
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  apiUrl: string = environment.apiUrl; 
  apiKey: string = environment.apiKey; 

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: "gpt-4o-2024-05-13",
      // model: "gpt-3.5-turbo", 
      messages: [{ role: "user", content: message }],
      max_tokens: 1000
    };
    console.log('Request body:', JSON.stringify(body));
    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        console.log('Response:', response); // Kiểm tra phản hồi từ API
        const choices = response.choices || [];
        if (choices.length > 0 && choices[0].message) {
          const content = choices.map((choice: any) => choice.message.content).join(' ');
          return { content, isUser: false };
        } else {
          console.error('No choices or message content found');
          return { content: 'No response content', isUser: false };
        }
      }),
      catchError(error => {
        console.error('Error:', error);
        return of({ content: 'An error occurred', isUser: false }); // `of` từ `rxjs` để trả về Observable
      })
    );
    
  }
  
}

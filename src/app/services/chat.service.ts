import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment'; // import environment

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
      model: "gpt-4o", 
      // model: "gpt-3.5-turbo", 
      messages: [{ role: "user", content: message }],
      max_tokens: 1000
    };
    console.log('Request body:', JSON.stringify(body));
    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => {
        // Extract content from response
        const choices = response.choices || [];
        const content: string = choices.map((choice: any) => choice.message.content).join(' ');
  
        // Return formatted message content
        return { content, isUser: false }; // Assuming this is how your message object is structured
      })
    );
    
  }
  
}

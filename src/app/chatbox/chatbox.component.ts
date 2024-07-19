import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit,Renderer2 } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements AfterViewChecked, OnInit {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  isChatboxOpen = false;
  isZoomed = false;
  messages: { content: string, isUser: boolean, username: string }[] = [];
  userInput: string = '';
  username: string = '';

  constructor(private chatService: ChatService,private renderer: Renderer2 ) {}
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.username = localStorage.getItem('username') || 'user';
      this.loadChatHistory();
    } else {
      this.username = 'user';
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleChatbox() {
    this.isChatboxOpen = !this.isChatboxOpen;
    this.isZoomed = false;
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ content: this.userInput, isUser: true, username: this.username });
      this.saveChatHistory();
      this.chatService.sendMessage(this.userInput).subscribe(response => {
        console.log(response);
        this.messages.push({ content: response.content, isUser: false, username: 'ChatGPT' });
        this.saveChatHistory();
      });
      this.userInput = '';
    }
  }

  private scrollToBottom() {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  private saveChatHistory() {
    localStorage.setItem('chatHistory_' + this.username, JSON.stringify(this.messages));
  }

  private loadChatHistory() {
    const savedMessages = localStorage.getItem('chatHistory_' + this.username);
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    } else {
      this.messages.push({ content: 'Hello! Can I help you?', isUser: false, username: 'ChatGPT' });
    }
  }
  toggleZoom() {
    this.isZoomed = !this.isZoomed;
    if (this.isZoomed) {
      this.isChatboxOpen = true; // Nếu zoom lên thì mở chatbox
    }
  }

 
}
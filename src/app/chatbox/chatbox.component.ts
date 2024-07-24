import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit, Renderer2 } from '@angular/core';
import { ChatService } from '../services/chat.service';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

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
  selectedFile: File | null = null;
  selectedFileName: string = '';
  constructor(private chatService: ChatService, private renderer: Renderer2) {}

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

  toggleZoom() {
    this.isZoomed = !this.isZoomed;
    if (this.isZoomed) {
      this.isChatboxOpen = true;
    }
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

    if (this.selectedFile) {
      this.messages.push({ content: `File uploaded: ${this.selectedFile.name}`, isUser: true, username: this.username });
      this.saveChatHistory();
      this.uploadFile(this.selectedFile).then(response => {
        this.messages.push({ content: response, isUser: false, username: 'ChatGPT' });
        this.saveChatHistory();
      });
      this.selectedFile = null; // Reset selected file
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

 
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = '';
    }
  }
  private async uploadFile(file: File): Promise<string> {
    try {
      const content = await this.extractDocxContent(file);
      const prompt = `Nội dung này nói về các ý chính nào: ${content}`;
      
      const response = await this.chatService.sendMessage(prompt).toPromise();
     if (response && response.content) {
      return response.content || 'No response from chat';
    } else {
      return 'Invalid response format';
    }
    } catch (error) {
      console.error('Error processing file upload', error);
      return 'Error processing file upload';
    }
  }
  
  

  private async extractDocxContent(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    return doc.getFullText();
  }
}

import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BASE_URL, API_HEADERS } from 'src/app/constants/api-endpoints';

interface ChatMessage {
  sessionId: string;
  userMessage: string;
  responseMessage: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NgScrollbarModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @Input() sessionId!: string; // session ID from sidebar selection
  messages: ChatMessage[] = [];
  newMessage = '';
  loading = false;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.sessionId) this.loadMessages();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadMessages(): void {
    this.loading = true;
    this.http.get<ChatMessage[]>(`${BASE_URL}/messages/${this.sessionId}`, { headers: new HttpHeaders(API_HEADERS) })
      .subscribe({
        next: (res) => {
          this.messages = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to fetch messages', err);
          this.loading = false;
        }
      });
  }

  sendMessage(): void {
    const trimmed = this.newMessage.trim();
    if (!trimmed || !this.sessionId) return;

    const payload = { userMessage: trimmed };

    this.http.post<ChatMessage>(`${BASE_URL}/messages/${this.sessionId}`, payload, { headers: new HttpHeaders(API_HEADERS) })
      .subscribe({
        next: (res) => {
          this.messages.push(res);
          this.newMessage = '';
          this.scrollToBottom();
        },
        error: (err) => console.error('Failed to send message', err)
      });
  }

  scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-empty
    } catch (err) {}
  }
}

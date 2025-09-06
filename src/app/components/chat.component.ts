import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { ActiveSessionService } from 'src/app/services/active-session.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  sessionId: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[] = [];
  newMessage = '';

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private route: ActivatedRoute,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private messageService: MessageService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private activeSessionService: ActiveSessionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sessionId = params.get('sessionId');
      if (this.sessionId) this.loadMessages(this.sessionId);
    });

    this.activeSessionService.activeSessionId$.subscribe(sessionId => {
      if (sessionId) {
        this.sessionId = sessionId;
        this.loadMessages(sessionId);
      } else {
        this.messages = [];
        this.sessionId = null;
      }
    });
  }

  loadMessages(sessionId: string) {
    this.messageService.getMessagesBySession(sessionId).subscribe({
      next: msgs => {
        this.messages = msgs || [];
        this.scrollToBottom();
      },
      error: err => console.error('Failed to fetch messages:', err)
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.sessionId) return;
    console.log('Send triggered:', this.newMessage);

    const msg = this.newMessage.trim();
    const tempMessage = { userMessage: msg, responseMessage: '...' };
    this.messages.push(tempMessage);
    this.scrollToBottom();
    this.newMessage = '';

    this.messageService.sendMessage(this.sessionId, msg).subscribe({
      next: res => {
        const lastMsg = this.messages[this.messages.length - 1];
        if (lastMsg) lastMsg.responseMessage = res?.responseMessage || '(no response)';
        this.scrollToBottom();
      },
      error: err => {
        console.error('Failed to send message:', err);
        alert('Failed to send message.');
      }
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}

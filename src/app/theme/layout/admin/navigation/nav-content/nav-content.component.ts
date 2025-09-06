import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- import FormsModule

@Component({
  selector: 'app-nav-content',
  standalone: true, // <-- make sure this is standalone if using imports array
  imports: [
    CommonModule,
    FormsModule, 
    NgbDropdownModule,
    NgScrollbarModule
  ],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss'] // fixed typo from styleUrl
})
export class NavContentComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessions: any[] = [];
  editingSessionId: string | null = null;
  creatingSession = false;
  newSessionName = '';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.refreshSessions();
  }

  refreshSessions() {
    this.sessionService.getSessions().subscribe({
      next: (data) => {
        this.sessions = data;
      },
      error: (err) => {
        console.error('Failed to fetch sessions:', err);
      }
    });
  }

  sortedSessions() {
    return [...this.sessions].sort((a, b) => (a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editSession(session: any) {
    this.editingSessionId = session.sessionId;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveSessionName(session: any) {
    const newName = session.sessionName;
    this.editingSessionId = null;
    if (!newName || !session.sessionId) return;

    this.sessionService.updateSessionName(session.sessionId, newName).subscribe({
      next: () => this.refreshSessions(),
      error: (err) => console.error('Failed to update session name', err)
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleFavorite(session: any) {
    if (!session.sessionId) return;
    this.sessionService.toggleFavorite(session.sessionId).subscribe({
      next: () => this.refreshSessions(),
      error: (err) => console.error('Failed to toggle favorite', err)
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteSession(session: any) {
    if (!session.sessionId) return;
    this.sessionService.deleteSession(session.sessionId).subscribe({
      next: () => this.refreshSessions(),
      error: (err) => console.error('Failed to delete session', err)
    });
  }

  cancelCreateSession() {
    this.creatingSession = false;
    this.newSessionName = '';
  }

  toggleCreateSession() {
    if (this.creatingSession) {
      // User clicked the minus icon: hide field and clear
      this.cancelCreateSession();
    } else {
      // Show the field
      this.creatingSession = true;
    }
  }

  createSession() {
  const trimmedName = this.newSessionName.trim();
  if (!trimmedName) return;

  this.sessionService.createSession({ sessionName: trimmedName }).subscribe({
    next: () => {
      this.creatingSession = false;
      this.newSessionName = '';
      this.refreshSessions();
    },
    error: (err) => {
      console.error('Failed to create session', err);
      alert(err?.error?.message || 'Failed to create session. Please try again later.');
    }
  });
}
}

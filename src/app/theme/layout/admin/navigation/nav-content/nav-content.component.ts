import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-nav-content',
  imports: [
    CommonModule,
    NgScrollbarModule,
    // ...other imports
  ],
  templateUrl: './nav-content.component.html',
  styleUrl: './nav-content.component.scss'
})
export class NavContentComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessions: any[] = [];
  editingSessionId: string | null = null;

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
    // Favorites on top, then others, keep original order for non-favorites
    return [...this.sessions].sort((a, b) => {
      if (a.favorite === b.favorite) return 0;
      return a.favorite ? -1 : 1;
    });
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
      next: () => {
        this.refreshSessions();
      },
      error: (err) => {
        console.error('Failed to update session name', err);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleFavorite(session: any) {
    if (!session.sessionId) return;
    this.sessionService.toggleFavorite(session.sessionId).subscribe({
      next: () => {
        this.refreshSessions();
      },
      error: (err) => {
        console.error('Failed to toggle favorite', err);
      }
    });
  }
}
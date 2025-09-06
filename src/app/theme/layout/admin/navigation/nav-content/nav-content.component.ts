import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- import FormsModule
import { SessionToggleService } from 'src/app/services/session-toggle.service';
import { ActiveSessionService } from 'src/app/services/active-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-content',
  standalone: true, // <-- make sure this is standalone if using imports array
  imports: [CommonModule, FormsModule, NgbDropdownModule, NgScrollbarModule],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss'] // fixed typo from styleUrl
})
export class NavContentComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessions: any[] = [];
  editingSessionId: string | null = null;
  activeSessionId: string | null = null;
  creatingSession = false;
  newSessionName = '';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private sessionService: SessionService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private toggleService: SessionToggleService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private activeSessionService: ActiveSessionService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshSessions();

    this.toggleService.toggle$.subscribe(() => {
      this.toggleCreateSession();
    });

    // Subscribe to the correct observable
    this.activeSessionService.activeSessionId$.subscribe((sessionId) => {
      this.activeSessionId = sessionId;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectSession(session: any) {
    if (!session?.sessionId) return;

    this.activeSessionId = session.sessionId;
    this.activeSessionService.setActiveSession(session.sessionId);
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
      next: () => {
        this.refreshSessions();

        // If no sessions are left, clear active session and navigate to default
        if (this.sessions.length === 1 && this.sessions[0].sessionId === session.sessionId) {
          this.activeSessionService.clearActiveSession();
          this.router.navigate(['/default']);
        }
      },
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openSession(session: any) {
    if (!session?.sessionId) return;
    this.activeSessionService.setActiveSession(session.sessionId);
    this.router.navigate(['/chat', session.sessionId]);
  }

  createSession() {
    const trimmedName = this.newSessionName.trim();
    if (!trimmedName) return;

    this.sessionService.createSession({ sessionName: trimmedName }).subscribe({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: (response: any) => {
        this.creatingSession = false;
        this.newSessionName = '';
        this.refreshSessions();

        // Navigate to the chat component for this new session
        const newSessionId = response?.sessionId;
        if (newSessionId) {
          this.activeSessionService.setActiveSession(newSessionId); // update active session
          this.router.navigate(['/chat', newSessionId]);
        }
      },
      error: (err) => {
        console.error('Failed to create session', err);
        alert(err?.error?.message || 'Failed to create session. Please try again later.');
      }
    });
  }
}

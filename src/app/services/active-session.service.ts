import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActiveSessionService {
  private activeSessionSubject = new BehaviorSubject<string | null>(null);
  activeSessionId$ = this.activeSessionSubject.asObservable();

  setActiveSession(sessionId: string) {
    this.activeSessionSubject.next(sessionId);
  }

  clearActiveSession() {
    this.activeSessionSubject.next(null);
  }
}

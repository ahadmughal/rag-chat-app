import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionToggleService {
  private toggleSource = new Subject<void>();
  toggle$ = this.toggleSource.asObservable();

  triggerToggle() {
    this.toggleSource.next();
  }
}

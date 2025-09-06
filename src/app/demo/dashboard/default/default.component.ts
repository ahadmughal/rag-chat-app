import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SessionToggleService } from 'src/app/services/session-toggle.service';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  @Input() hasSessions = false;

  // Event emitted to parent/dashboard to trigger "create session" in sidebar
  @Output() triggerCreateSession = new EventEmitter<void>();

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private toggleService: SessionToggleService) {}

  openCreateSession() {
  this.toggleService.triggerToggle();
}
}

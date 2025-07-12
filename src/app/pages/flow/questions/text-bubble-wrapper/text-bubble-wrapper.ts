import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TextBubbleConfig {
  isBotMessage?: boolean;
  isSent?: boolean;
  showProfilePicture?: boolean;
  maxWidth?: string;
  showSendButton?: boolean;
  sendButtonDisabled?: boolean;
}

@Component({
  selector: 'app-text-bubble-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="text-bubble"
      [class.bot-message]="config.isBotMessage"
      [class.user-message]="!config.isBotMessage"
      [class.sent]="config.isSent"
      [class.unsent]="!config.isSent"
      [style.max-width]="config.maxWidth || null"
    >
      <!-- Profile Picture for Bot Messages -->
      <div
        *ngIf="config.showProfilePicture && config.isBotMessage"
        class="profile-picture"
      >
        <div class="avatar">
          <img
            src="/images/favicon.png"
            alt="Bot"
            class="bot-avatar-image"
            width="32"
            height="32"
          />
        </div>
      </div>

      <!-- Content Area -->
      <div class="bubble-content">
        <ng-content></ng-content>
      </div>

      <!-- Send Button for User Messages -->
      <button
        *ngIf="config.showSendButton && !config.isBotMessage && !config.isSent"
        class="send-button"
        (click)="onSend.emit()"
        [attr.aria-label]="'Send message'"
        [disabled]="config.sendButtonDisabled"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  `,
  styleUrls: ['./text-bubble-wrapper.scss'],
})
export class TextBubbleWrapper {
  @Input() config: TextBubbleConfig = {
    isBotMessage: true,
    isSent: true,
    showProfilePicture: true,
    showSendButton: false,
    sendButtonDisabled: false,
  };

  @Output() onSend = new EventEmitter<void>();
}

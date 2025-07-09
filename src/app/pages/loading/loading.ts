import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrls: ['./loading.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {
  currentMessageIndex = 0;
  private messageInterval: any;

  loadingMessages = [
    'Personalizing your experience',
    'Crunching the numbers',
    'Gearing up for greatness',
    'Crafting your AI companion',
    'Almost there...',
    'Making magic happen'
  ];

  constructor(public themeService: ThemeService, private router: Router) {}

  ngOnInit() {
    this.startMessageCycle();
  }

  ngOnDestroy() {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
  }

  private startMessageCycle() {
    this.messageInterval = setInterval(() => {
      this.currentMessageIndex = (this.currentMessageIndex + 1) % this.loadingMessages.length;
    }, 3000); // Change message every 3 seconds
  }

} 
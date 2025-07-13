/**
 * Mobile Detection Service
 *
 * Detects mobile/tablet devices and provides reactive updates on screen size changes.
 * Used by app component to conditionally show mobile message or main content.
 * Threshold set at 768px (tablet breakpoint).
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MobileDetectionService {
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    this.checkMobile();
    this.setupResizeListener();
  }

  private checkMobile(): void {
    // Check if screen width is less than 768px (tablet breakpoint)
    const isMobile = window.innerWidth < 768;
    this.isMobileSubject.next(isMobile);
  }

  private setupResizeListener(): void {
    // Listen for window resize events to update mobile status
    window.addEventListener('resize', () => {
      this.checkMobile();
    });
  }

  // Synchronous getter for current mobile status
  get isMobile(): boolean {
    return this.isMobileSubject.value;
  }
}

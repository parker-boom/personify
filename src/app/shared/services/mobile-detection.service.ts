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
    window.addEventListener('resize', () => {
      this.checkMobile();
    });
  }

  get isMobile(): boolean {
    return this.isMobileSubject.value;
  }
}

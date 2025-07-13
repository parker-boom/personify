import { Component } from '@angular/core';
import { ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-mobile-message',
  standalone: true,
  templateUrl: './mobile-message.component.html',
  styleUrl: './mobile-message.component.scss',
})
export class MobileMessageComponent {
  constructor(public themeService: ThemeService) {}
}

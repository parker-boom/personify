import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(
    public themeService: ThemeService,
    private router: Router
  ) {}

  getStarted() {
    this.router.navigate(['/select']);
  }
}

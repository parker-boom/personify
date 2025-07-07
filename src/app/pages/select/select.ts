import { Component } from '@angular/core';
import { LayoutComponent } from '../../shared/components/layout/layout';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {}

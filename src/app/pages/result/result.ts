import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result {
  // Placeholder/mock data for now – will be replaced by API later
  traitsText = `I value curiosity, clarity and kindness. Please keep answers concise, cite sources when possible and proactively ask follow-up questions if requirements are ambiguous.`;
  extraText = `I prefer metric units, use British English spelling, and I’m learning Japanese—sprinkle in occasional vocabulary explanations when relevant.`;
  memoryLink = 'https://openai.com/personify/save-to-memory';

  constructor(public themeService: ThemeService) {}

  copyToClipboard(content: string): void {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(content);
    }
  }
}

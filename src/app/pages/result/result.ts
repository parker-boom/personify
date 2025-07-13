import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../../theme.service';
import { ProcessAnswersResponse } from '../../shared/services/api.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result {
  // Data from API response
  traitsText = '';
  extraText = '';
  memoryLink = '';

  // Copy animation states
  copyingTraits = false;
  copyingExtra = false;
  copyingMemory = false;

  constructor(public themeService: ThemeService, private router: Router) {
    // Get API response data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const apiResponse = navigation.extras.state[
        'apiResponse'
      ] as ProcessAnswersResponse;
      if (apiResponse) {
        this.traitsText = apiResponse.CustomInstructionQ1 || '';
        this.extraText = apiResponse.CustomInstructionQ2 || '';
        this.memoryLink = this.generateMemoryLink(
          apiResponse.MemoryPrompt || ''
        );
      }
    }

    // Fallback to default values if no API response
    if (!this.traitsText) {
      this.traitsText = `I value curiosity, clarity and kindness. Please keep answers concise, cite sources when possible and proactively ask follow-up questions if requirements are ambiguous.`;
    }
    if (!this.extraText) {
      this.extraText = `I prefer metric units, use British English spelling, and I'm learning Japanese—sprinkle in occasional vocabulary explanations when relevant.`;
    }
    if (!this.memoryLink) {
      this.memoryLink = 'https://openai.com/personify/save-to-memory';
    }
  }

  private generateMemoryLink(memoryPrompt: string): string {
    if (!memoryPrompt || memoryPrompt.trim() === '') {
      return 'https://chatgpt.com/';
    }

    // URL encode the prompt by replacing spaces with + and encoding special characters
    const encodedPrompt = encodeURIComponent(memoryPrompt).replace(/%20/g, '+');

    // Create the ChatGPT link with the encoded prompt
    return `https://chatgpt.com/?q=${encodedPrompt}`;
  }

  /**
   * Open the ChatGPT memory link in a new browser tab.
   * This is triggered by the "Save to ChatGPT's Memory" button.
   */
  openMemoryLink(): void {
    if (!this.memoryLink) {
      console.warn('⚠️ No memory link available to open');
      return;
    }

    // Open the link in a new tab/window. Fallback to same tab if blocked.
    const newWindow = window.open(this.memoryLink, '_blank');
    if (
      !newWindow ||
      newWindow.closed ||
      typeof newWindow.closed === 'undefined'
    ) {
      // If popup blocked, navigate in the current tab instead
      window.location.href = this.memoryLink;
    }
  }

  copyToClipboard(
    content: string,
    type: 'traits' | 'extra' | 'memory' = 'traits'
  ): void {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(content);

      // Set the appropriate copying state
      switch (type) {
        case 'traits':
          this.copyingTraits = true;
          setTimeout(() => (this.copyingTraits = false), 1000);
          break;
        case 'extra':
          this.copyingExtra = true;
          setTimeout(() => (this.copyingExtra = false), 1000);
          break;
        case 'memory':
          // No longer copying for memory; the button now opens the link.
          break;
      }
    }
  }
}

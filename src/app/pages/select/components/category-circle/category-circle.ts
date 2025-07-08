import { CommonModule, NgStyle } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ThemeService } from '../../../../theme.service';

function pastelize(hex: string, amount = 0.6): string {
  // Blend the color with white by the given amount (0-1)
  // hex: #RRGGBB
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const blend = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
}

@Component({
  selector: 'app-category-circle',
  standalone: true,
  imports: [NgStyle, CommonModule],
  templateUrl: './category-circle.html',
  styleUrl: './category-circle.scss'
})
export class CategoryCircle implements OnInit {
  @Input() label!: string;
  @Input() emoji!: string;
  @Input() weight!: number;
  @Input() color!: string; // base color
  @Output() clicked = new EventEmitter<void>();

  size = 180; // default size
  emojiSize = 3; // default emoji size in rem
  labelSize = 1.75; // default label size in rem
  pastelColor = '';
  showOverlay = true;

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    // Map weight (5-10) to size (190-280px)
    const minWeight = 5, maxWeight = 10;
    const minSize = 190, maxSize = 280;
    this.size = minSize + ((this.weight - minWeight) / (maxWeight - minWeight)) * (maxSize - minSize);
    
    // Map weight to emoji size (2.5rem - 3.5rem)
    const minEmojiSize = 2.5, maxEmojiSize = 3.5;
    this.emojiSize = minEmojiSize + ((this.weight - minWeight) / (maxWeight - minWeight)) * (maxEmojiSize - minEmojiSize);
    
    // Map weight to label size (1.5rem - 2rem)
    const minLabelSize = 1.5, maxLabelSize = 2;
    this.labelSize = minLabelSize + ((this.weight - minWeight) / (maxWeight - minWeight)) * (maxLabelSize - minLabelSize);
    
    this.pastelColor = pastelize(this.color, 0.6);
  }

  onHover() {
    this.showOverlay = false;
  }

  onClick() {
    this.clicked.emit();
  }
}

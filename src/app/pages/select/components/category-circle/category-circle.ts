import { CommonModule, NgStyle } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

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
  @Input() weight!: number;
  @Input() color!: string; // base color
  @Input() darkMode: boolean = false; // can be set by parent if needed
  @Output() clicked = new EventEmitter<void>();

  size = 120; // default size
  pastelColor = '';
  showOverlay = true;

  ngOnInit() {
    // Map weight (5-10) to size (120-200px)
    const minWeight = 5, maxWeight = 10;
    const minSize = 120, maxSize = 200;
    this.size = minSize + ((this.weight - minWeight) / (maxWeight - minWeight)) * (maxSize - minSize);
    this.pastelColor = pastelize(this.color, 0.6);
  }

  onHover() {
    this.showOverlay = false;
  }

  onClick() {
    this.clicked.emit();
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Occasion {
  name: string;
  tagline: string;
  image: string;
  emoji: string;
}

@Component({
  selector: 'app-occasions',
  imports: [],
  templateUrl: './occasions.html',
  styleUrl: './occasions.css',
})
export class Occasions {
  constructor(private router: Router) {}

  featured: Occasion = {
    name: 'Birthdays',
    tagline: 'Cakes, candles & confetti moments',
    image: '/assets/images/cake.jpg',
    emoji: '🎂',
  };

  occasions: Occasion[] = [
    {
      name: 'Anniversary',
      tagline: 'Bloom-fresh romance',
      image: '/assets/images/flowers.jpg',
      emoji: '💐',
    },
    {
      name: 'Weddings',
      tagline: 'Keepsakes they will treasure',
      image: '/assets/images/pendant.webp',
      emoji: '💍',
    },
    {
      name: 'Just Because',
      tagline: 'Sweet little surprises',
      image: '/assets/images/chocolates.jpg',
      emoji: '🍫',
    },
    {
      name: 'Thank You',
      tagline: 'Scents that say it best',
      image: '/assets/images/fragrances.jpg',
      emoji: '🌸',
    },
  ];

  onOccasionClick(): void {
    this.router.navigate(['/occasion']);
  }
}

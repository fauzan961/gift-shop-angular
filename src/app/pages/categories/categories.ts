import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Category {
  name: string;
  emoji: string;
  tagline: string;
  image: string;
  count: number;
  fromPrice: number;
  theme: string;
}

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  constructor(private router: Router) {}

  query = '';

  categories: Category[] = [
    { name: 'Flowers', emoji: '💐', tagline: 'Hand-tied blooms, cut fresh daily', image: '/assets/images/flowers.jpg', count: 42, fromPrice: 8.5, theme: 'tint-blush' },
    { name: 'Cakes', emoji: '🎂', tagline: 'Baked to order, delivered chilled', image: '/assets/images/cake.jpg', count: 28, fromPrice: 11, theme: 'tint-cream' },
    { name: 'Chocolates', emoji: '🍫', tagline: 'Belgian truffles & sweet boxes', image: '/assets/images/chocolates.jpg', count: 36, fromPrice: 4.5, theme: 'tint-cocoa' },
    { name: 'Toys', emoji: '🧸', tagline: 'Plush friends for every age', image: '/assets/images/toy.webp', count: 24, fromPrice: 6, theme: 'tint-mint' },
    { name: 'Fragrances', emoji: '🌸', tagline: 'Signature scents & gift sets', image: '/assets/images/fragrances.jpg', count: 31, fromPrice: 18, theme: 'tint-rose' },
    { name: 'Personalized Gifts', emoji: '✨', tagline: 'Engraved, printed, one of a kind', image: '/assets/images/pendant.webp', count: 19, fromPrice: 9.5, theme: 'tint-lilac' },
    { name: 'Jewellery', emoji: '💎', tagline: 'Keepsakes they will wear for years', image: '/assets/images/pendant.webp', count: 22, fromPrice: 24, theme: 'tint-lilac' },
    { name: 'Gift Hampers', emoji: '🎁', tagline: 'Curated bundles, beautifully boxed', image: '/assets/images/chocolates.jpg', count: 16, fromPrice: 15, theme: 'tint-cocoa' },
  ];

  get filteredCategories(): Category[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.categories;
    return this.categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)
    );
  }

  get totalGifts(): number {
    return this.categories.reduce((sum, c) => sum + c.count, 0);
  }

  clearQuery(): void {
    this.query = '';
  }

  openCategory(): void {
    this.router.navigate(['/products']);
  }

  browseOccasions(): void {
    this.router.navigate(['/occasion']);
  }
}

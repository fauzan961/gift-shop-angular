import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Category {
  name: string;
  count: string;
  image: string;
  theme: string;
}

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  constructor(private router: Router) {}

  categories: Category[] = [
    { name: 'Flowers', count: '128 gifts', image: '/assets/images/flowers.jpg', theme: 'tint-blush' },
    { name: 'Cakes', count: '96 gifts', image: '/assets/images/cake.jpg', theme: 'tint-cream' },
    { name: 'Jewellery', count: '74 gifts', image: '/assets/images/pendant.webp', theme: 'tint-lilac' },
    { name: 'Chocolates', count: '112 gifts', image: '/assets/images/chocolates.jpg', theme: 'tint-cocoa' },
    { name: 'Toys', count: '65 gifts', image: '/assets/images/toy.webp', theme: 'tint-mint' },
    { name: 'Fragrances', count: '88 gifts', image: '/assets/images/fragrances.jpg', theme: 'tint-rose' },
  ];

  onCategoryClick(): void {
    this.router.navigate(['/categories']);
  }
}

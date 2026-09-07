import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface OccasionItem {
  name: string;
  emoji: string;
  image: string;
  tagline: string;
  /** Fixed calendar date, when the occasion has one. Month is 1-based. */
  month?: number;
  day?: number;
}

interface Gift {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: 'Bestseller' | 'New' | 'Sale';
  occasions: string[];
  isFavorite: boolean;
}

@Component({
  selector: 'app-occasion',
  imports: [CommonModule, RouterLink],
  templateUrl: './occasion.html',
  styleUrl: './occasion.css',
})
export class Occasion {
  constructor(private router: Router) {}

  @ViewChild('giftsSection') giftsSection?: ElementRef<HTMLElement>;
  @ViewChild('occasionsSection') occasionsSection?: ElementRef<HTMLElement>;

  stars = [1, 2, 3, 4, 5];
  selectedOccasion: string | null = null;

  occasions: OccasionItem[] = [
    { name: 'Birthday', emoji: '🎂', image: '/assets/images/cake.jpg', tagline: 'Cakes & candles' },
    { name: 'Anniversary', emoji: '💐', image: '/assets/images/flowers.jpg', tagline: 'Bloom-fresh romance' },
    { name: 'Wedding', emoji: '💍', image: '/assets/images/pendant.webp', tagline: 'Keepsakes to treasure' },
    { name: 'Graduation', emoji: '🎓', image: '/assets/images/chocolates.jpg', tagline: 'Celebrate the win', month: 6, day: 15 },
    { name: 'Baby Shower', emoji: '🧸', image: '/assets/images/toy.webp', tagline: 'Soft & sweet welcomes' },
    { name: "Valentine's Day", emoji: '💕', image: '/assets/images/flowers.jpg', tagline: 'Say it with roses', month: 2, day: 14 },
    { name: "Mother's Day", emoji: '🌷', image: '/assets/images/fragrances.jpg', tagline: 'Spoil her rotten', month: 3, day: 21 },
    { name: "Father's Day", emoji: '🎁', image: '/assets/images/fragrances.jpg', tagline: 'For the man who has it all', month: 6, day: 21 },
  ];

  gifts: Gift[] = [
    { id: 1, name: 'Red Rose Grand Bouquet', category: 'Flowers', price: 18.5, oldPrice: 22, rating: 4.9, reviews: 214, image: '/assets/images/flowers.jpg', badge: 'Bestseller', occasions: ['Anniversary', "Valentine's Day", "Mother's Day"], isFavorite: false },
    { id: 2, name: 'Pink Velvet Celebration Cake', category: 'Cakes', price: 14, rating: 4.8, reviews: 168, image: '/assets/images/cake.jpg', badge: 'New', occasions: ['Birthday', 'Graduation', 'Baby Shower'], isFavorite: false },
    { id: 3, name: 'Rose Gold Heart Pendant', category: 'Jewellery', price: 32, oldPrice: 40, rating: 5, reviews: 96, image: '/assets/images/pendant.webp', badge: 'Sale', occasions: ['Wedding', 'Anniversary', "Valentine's Day"], isFavorite: false },
    { id: 4, name: 'Belgian Chocolate Luxury Box', category: 'Chocolates', price: 12.5, rating: 4.7, reviews: 302, image: '/assets/images/chocolates.jpg', occasions: ['Graduation', 'Birthday', "Father's Day"], isFavorite: false },
    { id: 5, name: 'Cuddly Teddy Bear Classic', category: 'Toys', price: 9, rating: 4.9, reviews: 143, image: '/assets/images/toy.webp', badge: 'Bestseller', occasions: ['Baby Shower', 'Birthday', "Valentine's Day"], isFavorite: false },
    { id: 6, name: 'Signature Perfume Duo Set', category: 'Fragrances', price: 28, oldPrice: 35, rating: 4.8, reviews: 187, image: '/assets/images/fragrances.jpg', badge: 'Sale', occasions: ["Father's Day", "Mother's Day", 'Wedding'], isFavorite: false },
    { id: 7, name: 'Blush Peony Hand-Tied Bunch', category: 'Flowers', price: 21, rating: 4.8, reviews: 42, image: '/assets/images/flowers.jpg', badge: 'New', occasions: ["Mother's Day", 'Wedding', 'Baby Shower'], isFavorite: false },
    { id: 8, name: 'Infinity Knot Diamond Pendant', category: 'Jewellery', price: 45, oldPrice: 56, rating: 5, reviews: 19, image: '/assets/images/pendant.webp', badge: 'Sale', occasions: ['Wedding', 'Anniversary', 'Graduation'], isFavorite: false },
    { id: 9, name: 'Strawberry Cream Layer Cake', category: 'Cakes', price: 16, rating: 4.8, reviews: 74, image: '/assets/images/cake.jpg', occasions: ['Birthday', 'Anniversary', "Mother's Day"], isFavorite: false },
    { id: 10, name: 'Mini Cocoa Truffle Jar', category: 'Chocolates', price: 4.5, oldPrice: 6, rating: 4.6, reviews: 88, image: '/assets/images/chocolates.jpg', badge: 'Sale', occasions: ["Valentine's Day", 'Baby Shower', "Father's Day"], isFavorite: false },
  ];

  // ---------- Dates ----------

  /** Days from today until the occasion's next occurrence, or null if it has no fixed date. */
  daysUntil(o: OccasionItem): number | null {
    if (!o.month || !o.day) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let next = new Date(today.getFullYear(), o.month - 1, o.day);
    if (next < today) next = new Date(today.getFullYear() + 1, o.month - 1, o.day);
    return Math.round((next.getTime() - today.getTime()) / 86400000);
  }

  dateLabel(o: OccasionItem): string {
    if (!o.month || !o.day) return 'Any day';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${o.day} ${months[o.month - 1]}`;
  }

  countdownLabel(o: OccasionItem): string {
    const d = this.daysUntil(o);
    if (d === null) return 'Gift any time';
    if (d === 0) return 'Today';
    if (d === 1) return 'Tomorrow';
    return `In ${d} days`;
  }

  /** The dated occasion arriving soonest — used for the spotlight card. */
  get nextOccasion(): OccasionItem {
    const dated = this.occasions.filter((o) => o.month && o.day);
    return dated.reduce((a, b) => (this.daysUntil(a)! <= this.daysUntil(b)! ? a : b));
  }

  /** Raw day count to the next dated occasion, for the countdown display. */
  get nextDays(): number {
    return this.daysUntil(this.nextOccasion) ?? 0;
  }

  scrollToOccasions(): void {
    this.occasionsSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- Gifts ----------

  giftCount(name: string): number {
    return this.gifts.filter((g) => g.occasions.includes(name)).length;
  }

  get filteredGifts(): Gift[] {
    if (!this.selectedOccasion) return this.gifts;
    return this.gifts.filter((g) => g.occasions.includes(this.selectedOccasion!));
  }

  get giftsHeading(): string {
    return this.selectedOccasion ? `Gifts for ${this.selectedOccasion}` : 'Popular Gift Ideas';
  }

  selectOccasion(name: string): void {
    this.selectedOccasion = this.selectedOccasion === name ? null : name;
    if (this.selectedOccasion) {
      setTimeout(() => {
        this.giftsSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  clearOccasion(): void {
    this.selectedOccasion = null;
  }

  discountPercent(g: Gift): number {
    if (!g.oldPrice || g.oldPrice <= g.price) return 0;
    return Math.round(((g.oldPrice - g.price) / g.oldPrice) * 100);
  }

  toggleFavorite(g: Gift, event: Event): void {
    event.stopPropagation();
    g.isFavorite = !g.isFavorite;
  }

  addToCart(g: Gift, event: Event): void {
    event.stopPropagation();
    console.log('Adding to cart:', g.name);
  }

  openGift(): void {
    this.router.navigate(['/product/slug']);
  }

  shopAll(): void {
    this.router.navigate(['/products']);
  }
}

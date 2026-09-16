import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface WishItem {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  /** How long ago it was saved, in days — drives the "Recently added" sort. */
  savedDaysAgo: number;
}

type SortKey = 'recent' | 'price-asc' | 'price-desc' | 'name';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist {
  constructor(private router: Router) {}

  stars = [1, 2, 3, 4, 5];
  sortBy: SortKey = 'recent';

  sortOptions: { value: SortKey; label: string }[] = [
    { value: 'recent', label: 'Recently added' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A–Z' },
  ];

  items: WishItem[] = [
    { id: 1, name: 'Rose Gold Heart Pendant', category: 'Jewellery', image: '/assets/images/pendant.webp', price: 32, oldPrice: 40, rating: 5, reviews: 96, inStock: true, savedDaysAgo: 1 },
    { id: 2, name: 'Red Rose Grand Bouquet', category: 'Flowers', image: '/assets/images/flowers.jpg', price: 18.5, oldPrice: 22, rating: 4.9, reviews: 214, inStock: true, savedDaysAgo: 2 },
    { id: 3, name: 'Pink Velvet Celebration Cake', category: 'Cakes', image: '/assets/images/cake.jpg', price: 14, rating: 4.8, reviews: 168, inStock: true, savedDaysAgo: 4 },
    { id: 4, name: 'Signature Perfume Duo Set', category: 'Fragrances', image: '/assets/images/fragrances.jpg', price: 28, oldPrice: 35, rating: 4.8, reviews: 187, inStock: false, savedDaysAgo: 6 },
    { id: 5, name: 'Belgian Chocolate Luxury Box', category: 'Chocolates', image: '/assets/images/chocolates.jpg', price: 12.5, rating: 4.7, reviews: 302, inStock: true, savedDaysAgo: 9 },
    { id: 6, name: 'Cuddly Teddy Bear Classic', category: 'Toys', image: '/assets/images/toy.webp', price: 9, rating: 4.9, reviews: 143, inStock: true, savedDaysAgo: 12 },
    { id: 7, name: 'Infinity Knot Diamond Pendant', category: 'Jewellery', image: '/assets/images/pendant.webp', price: 45, oldPrice: 56, rating: 5, reviews: 19, inStock: false, savedDaysAgo: 18 },
    { id: 8, name: 'Blush Peony Hand-Tied Bunch', category: 'Flowers', image: '/assets/images/flowers.jpg', price: 21, rating: 4.8, reviews: 42, inStock: true, savedDaysAgo: 23 },
  ];

  /** Ids showing the transient "Added" confirmation on their button. */
  addedIds = new Set<number>();

  toast: { text: string; canUndo: boolean } | null = null;
  private toastTimer?: ReturnType<typeof setTimeout>;
  private lastRemoved?: { item: WishItem; index: number };

  // ---------- Derived ----------

  get sortedItems(): WishItem[] {
    const list = [...this.items];
    switch (this.sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list.sort((a, b) => a.savedDaysAgo - b.savedDaysAgo);
    }
  }

  get inStockCount(): number {
    return this.items.filter((i) => i.inStock).length;
  }

  discountPercent(item: WishItem): number {
    if (!item.oldPrice || item.oldPrice <= item.price) return 0;
    return Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
  }

  savedLabel(item: WishItem): string {
    if (item.savedDaysAgo === 0) return 'Saved today';
    if (item.savedDaysAgo === 1) return 'Saved yesterday';
    if (item.savedDaysAgo < 7) return `Saved ${item.savedDaysAgo} days ago`;
    if (item.savedDaysAgo < 14) return 'Saved last week';
    return `Saved ${Math.floor(item.savedDaysAgo / 7)} weeks ago`;
  }

  // ---------- Actions ----------

  addToCart(item: WishItem, event: Event): void {
    event.stopPropagation();
    if (!item.inStock) return;

    console.log('Adding to cart:', item.name);
    this.addedIds.add(item.id);
    setTimeout(() => this.addedIds.delete(item.id), 2000);
  }

  addAllToCart(): void {
    const n = this.inStockCount;
    if (!n) return;

    console.log('Adding all in-stock wishlist items to cart');
    this.items.filter((i) => i.inStock).forEach((i) => this.addedIds.add(i.id));
    setTimeout(() => this.addedIds.clear(), 2000);
    this.showToast(`${n} ${n === 1 ? 'item' : 'items'} added to cart`, false);
  }

  remove(item: WishItem, event: Event): void {
    event.stopPropagation();
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index === -1) return;

    this.lastRemoved = { item, index };
    this.items = this.items.filter((i) => i.id !== item.id);
    this.showToast(`Removed “${item.name}”`, true);
  }

  undoRemove(): void {
    if (!this.lastRemoved) return;
    const { item, index } = this.lastRemoved;
    this.items = [...this.items.slice(0, index), item, ...this.items.slice(index)];
    this.lastRemoved = undefined;
    this.dismissToast();
  }

  clearAll(): void {
    if (!this.items.length) return;
    this.items = [];
    this.lastRemoved = undefined;
    this.showToast('Wishlist cleared', false);
  }

  private showToast(text: string, canUndo: boolean): void {
    this.toast = { text, canUndo };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 5000);
  }

  dismissToast(): void {
    clearTimeout(this.toastTimer);
    this.toast = null;
  }

  openItem(): void {
    this.router.navigate(['/product/slug']);
  }

  browseGifts(): void {
    this.router.navigate(['/products']);
  }
}

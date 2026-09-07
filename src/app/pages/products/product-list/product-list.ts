import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: 'Bestseller' | 'New' | 'Sale';
  gender: 'Men' | 'Women' | 'Unisex';
  age: '0-6 yrs' | '6-18 yrs' | '18+ yrs';
  isFavorite: boolean;
}

type FilterKey = 'category' | 'discount' | 'age' | 'gender' | 'price';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  constructor(private router: Router) {}

  showFilterModal = false;
  stars = [1, 2, 3, 4, 5];

  sortBy: 'latest' | 'price-asc' | 'price-desc' | 'rating' = 'latest';

  sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  filterGroups: { key: FilterKey; title: string; options: string[] }[] = [
    { key: 'category', title: 'Category', options: ['Flowers', 'Cakes', 'Jewellery', 'Chocolates', 'Toys', 'Fragrances'] },
    { key: 'price', title: 'Price', options: ['0-5 KWD', '5-10 KWD', '10-20 KWD', '20 KWD+'] },
    { key: 'discount', title: 'Discount', options: ['0-25%', '25-50%', '50% & Above'] },
    { key: 'age', title: 'Age', options: ['0-6 yrs', '6-18 yrs', '18+ yrs'] },
    { key: 'gender', title: 'Gender', options: ['Men', 'Women', 'Unisex'] },
  ];

  selected: Record<FilterKey, string[]> = {
    category: [],
    price: [],
    discount: [],
    age: [],
    gender: [],
  };

  collapse: Record<FilterKey, boolean> = {
    category: false,
    price: false,
    discount: false,
    age: false,
    gender: false,
  };

  products: Product[] = [
    { id: 12, name: 'Red Rose Grand Bouquet', category: 'Flowers', price: 18.5, oldPrice: 22, rating: 4.9, reviews: 214, image: '/assets/images/flowers.jpg', badge: 'Bestseller', gender: 'Women', age: '18+ yrs', isFavorite: false },
    { id: 11, name: 'Pink Velvet Celebration Cake', category: 'Cakes', price: 14, rating: 4.8, reviews: 168, image: '/assets/images/cake.jpg', badge: 'New', gender: 'Unisex', age: '6-18 yrs', isFavorite: false },
    { id: 10, name: 'Rose Gold Heart Pendant', category: 'Jewellery', price: 32, oldPrice: 40, rating: 5, reviews: 96, image: '/assets/images/pendant.webp', badge: 'Sale', gender: 'Women', age: '18+ yrs', isFavorite: false },
    { id: 9, name: 'Belgian Chocolate Luxury Box', category: 'Chocolates', price: 12.5, rating: 4.7, reviews: 302, image: '/assets/images/chocolates.jpg', gender: 'Unisex', age: '18+ yrs', isFavorite: false },
    { id: 8, name: 'Cuddly Teddy Bear Classic', category: 'Toys', price: 9, rating: 4.9, reviews: 143, image: '/assets/images/toy.webp', badge: 'Bestseller', gender: 'Unisex', age: '0-6 yrs', isFavorite: false },
    { id: 7, name: 'Signature Perfume Duo Set', category: 'Fragrances', price: 28, oldPrice: 35, rating: 4.8, reviews: 187, image: '/assets/images/fragrances.jpg', badge: 'Sale', gender: 'Men', age: '18+ yrs', isFavorite: false },
    { id: 6, name: 'Blush Peony Hand-Tied Bunch', category: 'Flowers', price: 21, rating: 4.8, reviews: 42, image: '/assets/images/flowers.jpg', badge: 'New', gender: 'Women', age: '18+ yrs', isFavorite: false },
    { id: 5, name: 'Mini Cocoa Truffle Jar', category: 'Chocolates', price: 4.5, oldPrice: 6, rating: 4.6, reviews: 88, image: '/assets/images/chocolates.jpg', badge: 'Sale', gender: 'Unisex', age: '6-18 yrs', isFavorite: false },
    { id: 4, name: 'Strawberry Cream Layer Cake', category: 'Cakes', price: 16, rating: 4.8, reviews: 74, image: '/assets/images/cake.jpg', gender: 'Unisex', age: '6-18 yrs', isFavorite: false },
    { id: 3, name: 'Honey Bear Plush Companion', category: 'Toys', price: 7.5, oldPrice: 11, rating: 4.6, reviews: 35, image: '/assets/images/toy.webp', badge: 'Sale', gender: 'Unisex', age: '0-6 yrs', isFavorite: false },
    { id: 2, name: 'Midnight Oud Eau de Parfum', category: 'Fragrances', price: 34, rating: 4.9, reviews: 28, image: '/assets/images/fragrances.jpg', badge: 'New', gender: 'Men', age: '18+ yrs', isFavorite: false },
    { id: 1, name: 'Infinity Knot Diamond Pendant', category: 'Jewellery', price: 45, oldPrice: 56, rating: 5, reviews: 19, image: '/assets/images/pendant.webp', badge: 'Sale', gender: 'Women', age: '18+ yrs', isFavorite: false },
  ];

  // ---------- Filtering ----------

  discountPercent(p: Product): number {
    if (!p.oldPrice || p.oldPrice <= p.price) return 0;
    return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  }

  private matchesPrice(p: Product, buckets: string[]): boolean {
    return buckets.some((b) => {
      if (b === '0-5 KWD') return p.price < 5;
      if (b === '5-10 KWD') return p.price >= 5 && p.price < 10;
      if (b === '10-20 KWD') return p.price >= 10 && p.price < 20;
      return p.price >= 20;
    });
  }

  private matchesDiscount(p: Product, buckets: string[]): boolean {
    const d = this.discountPercent(p);
    return buckets.some((b) => {
      if (b === '0-25%') return d > 0 && d <= 25;
      if (b === '25-50%') return d > 25 && d <= 50;
      return d > 50;
    });
  }

  get filteredProducts(): Product[] {
    const s = this.selected;
    const list = this.products.filter((p) => {
      if (s.category.length && !s.category.includes(p.category)) return false;
      if (s.gender.length && !s.gender.includes(p.gender)) return false;
      if (s.age.length && !s.age.includes(p.age)) return false;
      if (s.price.length && !this.matchesPrice(p, s.price)) return false;
      if (s.discount.length && !this.matchesDiscount(p, s.discount)) return false;
      return true;
    });

    switch (this.sortBy) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return [...list].sort((a, b) => b.id - a.id);
    }
  }

  // ---------- Filter interaction ----------

  isSelected(key: FilterKey, option: string): boolean {
    return this.selected[key].includes(option);
  }

  toggleOption(key: FilterKey, option: string): void {
    const list = this.selected[key];
    const i = list.indexOf(option);
    if (i === -1) list.push(option);
    else list.splice(i, 1);
  }

  /** Count of products that would remain if this option were the only extra filter. */
  optionCount(key: FilterKey, option: string): number {
    return this.products.filter((p) => {
      if (key === 'category') return p.category === option;
      if (key === 'gender') return p.gender === option;
      if (key === 'age') return p.age === option;
      if (key === 'price') return this.matchesPrice(p, [option]);
      return this.matchesDiscount(p, [option]);
    }).length;
  }

  get activeChips(): { key: FilterKey; value: string }[] {
    return (Object.keys(this.selected) as FilterKey[]).flatMap((key) =>
      this.selected[key].map((value) => ({ key, value }))
    );
  }

  get activeFilterCount(): number {
    return this.activeChips.length;
  }

  removeChip(chip: { key: FilterKey; value: string }): void {
    this.toggleOption(chip.key, chip.value);
  }

  clearAllFilters(): void {
    (Object.keys(this.selected) as FilterKey[]).forEach((k) => (this.selected[k] = []));
  }

  toggleSection(key: FilterKey): void {
    this.collapse[key] = !this.collapse[key];
  }

  // ---------- Drawer ----------

  toggleFilterModal(): void {
    this.showFilterModal = !this.showFilterModal;
    document.body.style.overflow = this.showFilterModal ? 'hidden' : '';
  }

  closeFilterModal(): void {
    this.showFilterModal = false;
    document.body.style.overflow = '';
  }

  // ---------- Product actions ----------

  toggleFavorite(p: Product, event: Event): void {
    event.stopPropagation();
    p.isFavorite = !p.isFavorite;
  }

  addToCart(p: Product, event: Event): void {
    event.stopPropagation();
    console.log('Adding to cart:', p.name);
  }

  openProduct(): void {
    this.router.navigate(['/product/slug']);
  }
}

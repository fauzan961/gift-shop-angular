import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface GalleryImage {
  src: string;
  alt: string;
}

interface Review {
  name: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
}

interface RelatedProduct {
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  isFavorite: boolean;
}

const SAME_DAY_CUTOFF_HOUR = 18;
const FREE_DELIVERY_FROM = 25;
const MAX_PER_ORDER = 10;
const REVIEWS_PREVIEW = 4;

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  @ViewChild('reviewsSection') reviewsSection?: ElementRef<HTMLElement>;

  readonly stars = [1, 2, 3, 4, 5];
  readonly freeDeliveryFrom = FREE_DELIVERY_FROM;

  product = {
    name: 'Forever Yours Gift Set',
    category: 'Gift Hampers',
    price: 48,
    oldPrice: 56,
    stock: 6,
    summary:
      'A rose gold heart pendant, a hand-tied bouquet of red roses and a box of Belgian chocolates — wrapped together in our signature plum box with a handwritten card.',
    occasions: ['Anniversary', "Valentine's Day", 'Birthday'],
    images: [
      { src: '/assets/images/pendant.webp', alt: 'Rose gold heart pendant' },
      { src: '/assets/images/flowers.jpg', alt: 'Red rose bouquet' },
      { src: '/assets/images/chocolates.jpg', alt: 'Belgian chocolate box' },
      { src: '/assets/images/cake.jpg', alt: 'Optional celebration cake add-on' },
    ] as GalleryImage[],
  };

  reviews: Review[] = [
    { name: 'Layla Al-Sabah', date: '18 Sep 2026', rating: 5, verified: true, comment: 'Delivered on time for our anniversary and the roses were still perfect three days later. The pendant is even prettier in person.' },
    { name: 'Omar Haddad', date: '09 Sep 2026', rating: 5, verified: true, comment: 'I am terrible at picking gifts — this did all the work for me. The box itself looks expensive.' },
    { name: 'Sara Mansour', date: '27 Aug 2026', rating: 4, verified: true, comment: 'Lovely set. Chocolates were excellent; I just wish the chain were a little longer.' },
    { name: 'Fatima Al-Ali', date: '14 Aug 2026', rating: 5, verified: false, comment: 'Handwritten card was a beautiful touch. My mum cried!' },
    { name: 'Yousef Karam', date: '02 Aug 2026', rating: 5, verified: true, comment: 'Same-day delivery actually arrived in the slot I picked. Will order again.' },
    { name: 'Noor Hassan', date: '21 Jul 2026', rating: 3, verified: true, comment: 'Good quality, but two roses were slightly bruised. Customer service replaced them quickly.' },
    { name: 'Hamad Al-Mutairi', date: '05 Jul 2026', rating: 5, verified: true, comment: 'Exactly as pictured. Great value for everything that comes in the box.' },
    { name: 'Dana Qasem', date: '19 Jun 2026', rating: 4, verified: false, comment: 'Beautiful presentation. Delivery was about 30 minutes late but they called ahead.' },
  ];

  related: RelatedProduct[] = [
    { slug: 'red-rose-grand-bouquet', name: 'Red Rose Grand Bouquet', category: 'Flowers', image: '/assets/images/flowers.jpg', price: 18.5, oldPrice: 22, rating: 4.9, reviews: 214, isFavorite: false },
    { slug: 'belgian-chocolate-luxury-box', name: 'Belgian Chocolate Luxury Box', category: 'Chocolates', image: '/assets/images/chocolates.jpg', price: 12.5, rating: 4.7, reviews: 302, isFavorite: false },
    { slug: 'pink-velvet-celebration-cake', name: 'Pink Velvet Celebration Cake', category: 'Cakes', image: '/assets/images/cake.jpg', price: 14, rating: 4.8, reviews: 168, isFavorite: false },
    { slug: 'signature-perfume-duo-set', name: 'Signature Perfume Duo Set', category: 'Fragrances', image: '/assets/images/fragrances.jpg', price: 28, oldPrice: 35, rating: 4.8, reviews: 187, isFavorite: false },
  ];

  activeImage = 0;
  quantity = 1;
  isFavorite = false;
  added = false;
  showAllReviews = false;
  relatedAdded = new Set<string>();
  deliveryLine = '';

  private addedTimer?: ReturnType<typeof setTimeout>;
  private clockTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.updateDeliveryLine();
    this.clockTimer = setInterval(() => this.updateDeliveryLine(), 30_000);
  }

  ngOnDestroy(): void {
    clearInterval(this.clockTimer);
    clearTimeout(this.addedTimer);
  }

  get maxQty(): number {
    return Math.min(MAX_PER_ORDER, this.product.stock);
  }

  get inStock(): boolean {
    return this.product.stock > 0;
  }

  get lowStock(): boolean {
    return this.inStock && this.product.stock <= 8;
  }

  get discountPercent(): number {
    const { price, oldPrice } = this.product;
    return oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  }

  get savings(): number {
    return this.product.oldPrice ? this.product.oldPrice - this.product.price : 0;
  }

  get lineTotal(): number {
    return this.product.price * this.quantity;
  }

  get averageRating(): number {
    if (!this.reviews.length) return 0;
    return this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length;
  }

  get ratingBreakdown(): { star: number; count: number; percent: number }[] {
    const total = this.reviews.length || 1;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = this.reviews.filter((r) => r.rating === star).length;
      return { star, count, percent: Math.round((count / total) * 100) };
    });
  }

  get visibleReviews(): Review[] {
    return this.showAllReviews ? this.reviews : this.reviews.slice(0, REVIEWS_PREVIEW);
  }

  get hiddenReviewCount(): number {
    return Math.max(0, this.reviews.length - REVIEWS_PREVIEW);
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');
  }

  starFill(star: number, rating: number): number {
    return Math.max(0, Math.min(1, rating - (star - 1))) * 100;
  }

  selectImage(index: number): void {
    this.activeImage = index;
  }

  prevImage(): void {
    const n = this.product.images.length;
    this.activeImage = (this.activeImage - 1 + n) % n;
  }

  nextImage(): void {
    this.activeImage = (this.activeImage + 1) % this.product.images.length;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQty(): void {
    if (this.quantity < this.maxQty) this.quantity++;
  }

  addToCart(): void {
    if (!this.inStock) return;
    console.log('Adding to cart:', this.product.name, '×', this.quantity);
    this.added = true;
    clearTimeout(this.addedTimer);
    this.addedTimer = setTimeout(() => (this.added = false), 2200);
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  scrollToReviews(): void {
    this.reviewsSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleReviews(): void {
    this.showAllReviews = !this.showAllReviews;
  }

  openRelated(item: RelatedProduct): void {
    this.router.navigate(['/product', item.slug]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addRelated(item: RelatedProduct, event: Event): void {
    event.stopPropagation();
    console.log('Adding to cart:', item.name);
    this.relatedAdded.add(item.slug);
    setTimeout(() => this.relatedAdded.delete(item.slug), 2000);
  }

  toggleRelatedFavorite(item: RelatedProduct, event: Event): void {
    event.stopPropagation();
    item.isFavorite = !item.isFavorite;
  }

  private updateDeliveryLine(): void {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setHours(SAME_DAY_CUTOFF_HOUR, 0, 0, 0);
    const minsLeft = Math.floor((cutoff.getTime() - now.getTime()) / 60_000);

    if (minsLeft > 0) {
      const h = Math.floor(minsLeft / 60);
      const m = minsLeft % 60;
      this.deliveryLine = `Order within ${h ? h + 'h ' : ''}${m}m for delivery today`;
    } else {
      this.deliveryLine = 'Order now for delivery tomorrow';
    }
  }
}

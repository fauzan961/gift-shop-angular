import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

export interface Gift {
  id: number;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  badge?: 'bestseller' | 'new' | 'sale';
  isFavorite: boolean;
}

@Component({
  selector: 'app-gifts-carousel',
  imports: [],
  templateUrl: './gifts-carousel.html',
  styleUrl: './gifts-carousel.css',
})
export class GiftsCarousel implements AfterViewInit {
  constructor(private router: Router) {}

  @ViewChild('giftsContainer') giftsContainer!: ElementRef<HTMLElement>;
  @Input() title: string = '';
  @Input() eyebrow: string = '';
  @Input() gifts: Gift[] = [
    {
      id: 1,
      name: 'Red Rose Grand Bouquet',
      category: 'Flowers',
      price: '18.500 KWD',
      oldPrice: '22.000 KWD',
      image: '/assets/images/flowers.jpg',
      rating: 4.9,
      reviews: 214,
      badge: 'bestseller',
      isFavorite: false,
    },
    {
      id: 2,
      name: 'Pink Velvet Celebration Cake',
      category: 'Cakes',
      price: '14.000 KWD',
      image: '/assets/images/cake.jpg',
      rating: 4.8,
      reviews: 168,
      badge: 'new',
      isFavorite: false,
    },
    {
      id: 3,
      name: 'Rose Gold Heart Pendant',
      category: 'Jewellery',
      price: '32.000 KWD',
      oldPrice: '40.000 KWD',
      image: '/assets/images/pendant.webp',
      rating: 5.0,
      reviews: 96,
      badge: 'sale',
      isFavorite: false,
    },
    {
      id: 4,
      name: 'Belgian Chocolate Luxury Box',
      category: 'Chocolates',
      price: '12.500 KWD',
      image: '/assets/images/chocolates.jpg',
      rating: 4.7,
      reviews: 302,
      isFavorite: false,
    },
    {
      id: 5,
      name: 'Cuddly Teddy Bear Classic',
      category: 'Toys',
      price: '9.000 KWD',
      image: '/assets/images/toy.webp',
      rating: 4.9,
      reviews: 143,
      badge: 'bestseller',
      isFavorite: false,
    },
    {
      id: 6,
      name: 'Signature Perfume Duo Set',
      category: 'Fragrances',
      price: '28.000 KWD',
      oldPrice: '35.000 KWD',
      image: '/assets/images/fragrances.jpg',
      rating: 4.8,
      reviews: 187,
      badge: 'sale',
      isFavorite: false,
    },
  ];

  stars = [1, 2, 3, 4, 5];
  showLeftArrow = false;
  showRightArrow = true;

  ngAfterViewInit() {
    this.updateArrowVisibility();
  }

  scrollLeft(): void {
    const container = this.giftsContainer.nativeElement;
    container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
    setTimeout(() => this.updateArrowVisibility(), 300);
  }

  scrollRight(): void {
    const container = this.giftsContainer.nativeElement;
    container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
    setTimeout(() => this.updateArrowVisibility(), 300);
  }

  updateArrowVisibility(): void {
    const container = this.giftsContainer?.nativeElement;
    if (!container) return;

    this.showLeftArrow = container.scrollLeft > 10;
    this.showRightArrow =
      container.scrollLeft < container.scrollWidth - container.offsetWidth - 10;
  }

  badgeLabel(badge: Gift['badge']): string {
    if (badge === 'bestseller') return 'Bestseller';
    if (badge === 'new') return 'New';
    if (badge === 'sale') return 'Save 20%';
    return '';
  }

  toggleFavorite(gift: Gift, event: Event): void {
    event.stopPropagation();
    gift.isFavorite = !gift.isFavorite;
  }

  buyGift(gift: Gift, event: Event): void {
    event.stopPropagation();
    console.log('Adding to cart:', gift.name);
  }

  viewAll(): void {
    this.router.navigate(['/products']);
  }

  productDetails(): void {
    this.router.navigate(['/product/slug']);
  }
}

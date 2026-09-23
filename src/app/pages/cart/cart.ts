import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

interface CartItem {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  qty: number;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  constructor(private router: Router, private auth: AuthService) {}

  /** Placeholder commerce rules — wire these to your pricing service. */
  readonly deliveryFee = 2;
  readonly freeDeliveryFrom = 25;

  items: CartItem[] = [
    { id: 1, name: 'Red Rose Grand Bouquet', category: 'Flowers', image: '/assets/images/flowers.jpg', price: 18.5, oldPrice: 22, qty: 1 },
    { id: 2, name: 'Belgian Chocolate Luxury Box', category: 'Chocolates', image: '/assets/images/chocolates.jpg', price: 12.5, qty: 2 },
    { id: 3, name: 'Cuddly Teddy Bear Classic', category: 'Toys', image: '/assets/images/toy.webp', price: 9, qty: 1 },
  ];

  // ---------- Totals ----------

  get itemCount(): number {
    return this.items.reduce((n, i) => n + i.qty, 0);
  }

  get subtotal(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  get savings(): number {
    return this.items.reduce(
      (sum, i) => sum + (i.oldPrice ? (i.oldPrice - i.price) * i.qty : 0),
      0
    );
  }

  get hasFreeDelivery(): boolean {
    return this.subtotal >= this.freeDeliveryFrom;
  }

  get delivery(): number {
    return this.hasFreeDelivery ? 0 : this.deliveryFee;
  }

  get total(): number {
    return this.subtotal + this.delivery;
  }

  get amountToFreeDelivery(): number {
    return Math.max(0, this.freeDeliveryFrom - this.subtotal);
  }

  get freeDeliveryProgress(): number {
    return Math.min(100, (this.subtotal / this.freeDeliveryFrom) * 100);
  }

  lineTotal(item: CartItem): number {
    return item.price * item.qty;
  }

  // ---------- Item actions ----------

  increment(item: CartItem): void {
    if (item.qty < 99) item.qty++;
  }

  decrement(item: CartItem): void {
    if (item.qty > 1) item.qty--;
  }

  remove(item: CartItem): void {
    this.items = this.items.filter((i) => i.id !== item.id);
  }

  // ---------- Navigation ----------

  checkout(): void {
    // Buying requires an account: sign in first, then resume to checkout.
    this.auth.requireLogin('Please sign in to complete your order.', () =>
      this.router.navigate(['/checkout/1'])
    );
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

export type OrderStatus = 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';

interface OrderItem {
  name: string;
  category: string;
  image: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  placedOn: string;
  status: OrderStatus;
  items: OrderItem[];
  delivery: number;
  recipient: string;
  address: string;
  payment: string;
  when: string;
}

interface Filter {
  key: 'all' | OrderStatus;
  label: string;
}

const TRACK_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'preparing', label: 'Preparing' },
  { key: 'on-the-way', label: 'On the way' },
  { key: 'delivered', label: 'Delivered' },
];

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  constructor(private router: Router) {}

  readonly steps = TRACK_STEPS;

  activeFilter: Filter['key'] = 'all';

  filters: Filter[] = [
    { key: 'all', label: 'All' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'on-the-way', label: 'On the way' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  expanded = new Set<string>();

  orders: Order[] = [
    {
      id: 'MWD-10428',
      placedOn: '21 Sep 2026',
      status: 'on-the-way',
      when: 'Arriving today, 3:00 PM – 6:00 PM',
      recipient: 'Layla Al-Sabah',
      address: 'Block 5, Salmiya, Kuwait City',
      payment: 'Knet',
      delivery: 0,
      items: [
        { name: 'Red Rose Grand Bouquet', category: 'Flowers', image: '/assets/images/flowers.jpg', qty: 1, price: 18.5 },
        { name: 'Belgian Chocolate Luxury Box', category: 'Chocolates', image: '/assets/images/chocolates.jpg', qty: 2, price: 12.5 },
      ],
    },
    {
      id: 'MWD-10391',
      placedOn: '18 Sep 2026',
      status: 'preparing',
      when: 'Scheduled for 24 Sep, 9:00 AM – 12:00 PM',
      recipient: 'Omar Haddad',
      address: 'Block 2, Hawally',
      payment: 'Apple Pay',
      delivery: 2,
      items: [
        { name: 'Pink Velvet Celebration Cake', category: 'Cakes', image: '/assets/images/cake.jpg', qty: 1, price: 14 },
      ],
    },
    {
      id: 'MWD-10247',
      placedOn: '02 Sep 2026',
      status: 'delivered',
      when: 'Delivered 03 Sep, 11:20 AM',
      recipient: 'Sara Mansour',
      address: 'Block 11, Jabriya',
      payment: 'Credit card',
      delivery: 0,
      items: [
        { name: 'Rose Gold Heart Pendant', category: 'Jewellery', image: '/assets/images/pendant.webp', qty: 1, price: 32 },
        { name: 'Cuddly Teddy Bear Classic', category: 'Toys', image: '/assets/images/toy.webp', qty: 1, price: 9 },
        { name: 'Mini Cocoa Truffle Jar', category: 'Chocolates', image: '/assets/images/chocolates.jpg', qty: 2, price: 4.5 },
      ],
    },
    {
      id: 'MWD-10102',
      placedOn: '14 Aug 2026',
      status: 'cancelled',
      when: 'Cancelled 14 Aug — refunded to Knet',
      recipient: 'Fatima Al-Ali',
      address: 'Block 7, Salmiya',
      payment: 'Knet',
      delivery: 2,
      items: [
        { name: 'Signature Perfume Duo Set', category: 'Fragrances', image: '/assets/images/fragrances.jpg', qty: 1, price: 28 },
      ],
    },
  ];

  // ---------- Derived ----------

  get filteredOrders(): Order[] {
    if (this.activeFilter === 'all') return this.orders;
    return this.orders.filter((o) => o.status === this.activeFilter);
  }

  countFor(key: Filter['key']): number {
    return key === 'all' ? this.orders.length : this.orders.filter((o) => o.status === key).length;
  }

  itemCount(order: Order): number {
    return order.items.reduce((n, i) => n + i.qty, 0);
  }

  subtotal(order: Order): number {
    return order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  total(order: Order): number {
    return this.subtotal(order) + order.delivery;
  }

  statusLabel(status: OrderStatus): string {
    if (status === 'preparing') return 'Preparing';
    if (status === 'on-the-way') return 'On the way';
    if (status === 'delivered') return 'Delivered';
    return 'Cancelled';
  }

  stepIndex(order: Order): number {
    return TRACK_STEPS.findIndex((s) => s.key === order.status);
  }

  isStepDone(order: Order, index: number): boolean {
    return index < this.stepIndex(order);
  }

  isStepCurrent(order: Order, index: number): boolean {
    return index === this.stepIndex(order);
  }

  trackProgress(order: Order): number {
    const i = this.stepIndex(order);
    if (i <= 0) return 0;
    return (i / (TRACK_STEPS.length - 1)) * 100;
  }

  setFilter(key: Filter['key']): void {
    this.activeFilter = key;
  }

  toggle(order: Order): void {
    if (this.expanded.has(order.id)) this.expanded.delete(order.id);
    else this.expanded.add(order.id);
  }

  isExpanded(order: Order): boolean {
    return this.expanded.has(order.id);
  }

  reorder(order: Order, event: Event): void {
    event.stopPropagation();
    console.log('Reordering', order.id, order.items.map((i) => i.name));
    this.router.navigate(['/cart']);
  }

  browseGifts(): void {
    this.router.navigate(['/products']);
  }
}

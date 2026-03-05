import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  showFilterModal:boolean = false;
  products = [
  {
    name: 'Premium Headphones',
    price: 120,
    oldPrice: 160,
    reviews: 54,
    badge: 'Sale',
    image: 'https://picsum.photos/400/300?1'
  },
  {
    name: 'Smart Watch',
    price: 220,
    oldPrice: 260,
    reviews: 33,
    badge: 'Popular',
    image: 'https://picsum.photos/400/300?2'
  },
  {
    name: 'Leather Bag',
    price: 89,
    oldPrice: 120,
    reviews: 18,
    badge: 'New',
    image: 'https://picsum.photos/400/300?3'
  }
];

  collapse = {
    sort: false,
    category: false,
    discount: false,
    age: false,
    gender: false,
    price: false
  };

  toggleSection(section: keyof typeof this.collapse) {
    this.collapse[section] = !this.collapse[section];
  }

  toggleFilterModal(){
    this.showFilterModal = !this.showFilterModal;
  }
}

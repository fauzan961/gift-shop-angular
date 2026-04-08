import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {

categories = [
  { name: 'Flowers', image: 'https://picsum.photos/400/300?31' },
  { name: 'Cakes', image: 'https://picsum.photos/400/300?32' },
  { name: 'Chocolates', image: 'https://picsum.photos/400/300?33' },
  { name: 'Toys', image: 'https://picsum.photos/400/300?34' },
  { name: 'Fragrances', image: 'https://picsum.photos/400/300?35' },
  { name: 'Personalized Gifts', image: 'https://picsum.photos/400/300?36' },
  { name: 'Jewelry', image: 'https://picsum.photos/400/300?37' },
  { name: 'Gift Hampers', image: 'https://picsum.photos/400/300?38' }
];
}

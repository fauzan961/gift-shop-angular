import { Component } from '@angular/core';
import { GiftsCarousel, Gift } from '../../layout/sections/gifts-carousel/gifts-carousel';
import { Categories } from '../../layout/sections/categories/categories';
import { Occasions } from '../../layout/sections/occasions/occasions';
import { Testimonials } from '../../layout/sections/testimonials/testimonials';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [GiftsCarousel, Categories, Occasions, Testimonials],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home{
  constructor(private router: Router){}

  newArrivals: Gift[] = [
    {
      id: 101,
      name: 'Blush Peony Hand-Tied Bunch',
      category: 'Flowers',
      price: '21.000 KWD',
      image: '/assets/images/flowers.jpg',
      rating: 4.8,
      reviews: 42,
      badge: 'new',
      isFavorite: false,
    },
    {
      id: 102,
      name: 'Midnight Oud Eau de Parfum',
      category: 'Fragrances',
      price: '34.000 KWD',
      image: '/assets/images/fragrances.jpg',
      rating: 4.9,
      reviews: 28,
      badge: 'new',
      isFavorite: false,
    },
    {
      id: 103,
      name: 'Salted Caramel Truffle Tray',
      category: 'Chocolates',
      price: '15.500 KWD',
      image: '/assets/images/chocolates.jpg',
      rating: 4.7,
      reviews: 61,
      isFavorite: false,
    },
    {
      id: 104,
      name: 'Infinity Knot Diamond Pendant',
      category: 'Jewellery',
      price: '45.000 KWD',
      oldPrice: '56.000 KWD',
      image: '/assets/images/pendant.webp',
      rating: 5.0,
      reviews: 19,
      badge: 'sale',
      isFavorite: false,
    },
    {
      id: 105,
      name: 'Strawberry Cream Layer Cake',
      category: 'Cakes',
      price: '16.000 KWD',
      image: '/assets/images/cake.jpg',
      rating: 4.8,
      reviews: 74,
      badge: 'new',
      isFavorite: false,
    },
    {
      id: 106,
      name: 'Honey Bear Plush Companion',
      category: 'Toys',
      price: '11.000 KWD',
      image: '/assets/images/toy.webp',
      rating: 4.6,
      reviews: 35,
      isFavorite: false,
    },
  ];

  heroStars = [1, 2, 3, 4, 5];

  onShopClick(){
  this.router.navigate(['/products']);
  }

  onOccasionClick(){
    this.router.navigate(['/occasion']);
  }
}

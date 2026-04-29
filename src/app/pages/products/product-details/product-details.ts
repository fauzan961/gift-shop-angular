import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms'

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  personalMessage: string = '';

  product = { description: 'Lorem Ipsum dolor sample text, Description here', 
    image: 'https://picsum.photos/400/300?31', images: ['https://picsum.photos/400/300?35', 'https://picsum.photos/400/300?34', 'https://picsum.photos/400/300?24', 'https://picsum.photos/400/300?22'],
     name: "Silver ring", price: "25 KWD", rating: 5, 
    reviews: [{name: "Jane Doe", comment: "Stunning!", rating: 5},
      {name: "Jane Doe", comment: "Stunning!", rating: 5},
      {name: "Shawn Jey", comment: "Beautiful!", rating: 5},
      {name: "Marshall", comment: "Good product.", rating: 4},
      {name: "Kane Wil", comment: "Stunning!", rating: 5},
      {name: "William Anthony", comment: "Average!!", rating: 3},
      {name: "Anthony Paul", comment: "Nice Quality, great product..", rating: 5},
      {name: "Pearl Dane", comment: "Absolutely loved it, Fantastic!!", rating: 5},
      {name: "Peter John", comment: "Nice, good for daily use.", rating: 3},
    ] }

  relatedProducts = [
      {image: "https://picsum.photos/400/300?33", name: "Silver Bracelet", price: "10 KWD"},
      {image: "https://picsum.photos/400/300?32", name: "Silver Necklace", price: "17 KWD"},
  ]
  quantity = 1

  addToCart(){
    console.log('Added to cart')
  }

  decreaseQty(){
    console.log('Added to cart')
  }

  increaseQty(){
    console.log('Added to cart')
  }

}

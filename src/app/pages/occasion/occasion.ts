import { Component } from '@angular/core';

@Component({
  selector: 'app-occasion',
  imports: [],
  templateUrl: './occasion.html',
  styleUrl: './occasion.css',
})
export class Occasion {

  occasions = [
  { name: 'Birthday', image: 'https://picsum.photos/400/300?1' },
  { name: 'Anniversary', image: 'https://picsum.photos/400/300?2' },
  { name: 'Wedding', image: 'https://picsum.photos/400/300?3' },
  { name: 'Graduation', image: 'https://picsum.photos/400/300?4' },
  { name: 'Baby Shower', image: 'https://picsum.photos/400/300?5' },
  { name: "Valentine's Day", image: 'https://picsum.photos/400/300?6' },
  { name: "Mother's Day", image: 'https://picsum.photos/400/300?7' },
  { name: "Father's Day", image: 'https://picsum.photos/400/300?8' }
];

gifts = [
  { name: 'Luxury Flower Box', price: 49, image: 'https://picsum.photos/400/300?9' },
  { name: 'Chocolate Gift Basket', price: 39, image: 'https://picsum.photos/400/300?10' },
  { name: 'Romantic Candle Set', price: 29, image: 'https://picsum.photos/400/300?11' },
  { name: 'Personalized Mug', price: 19, image: 'https://picsum.photos/400/300?12' }
];

}

import { Component } from '@angular/core';
import { GiftsCarousel } from '../../layout/sections/gifts-carousel/gifts-carousel';

@Component({
  selector: 'app-home',
  imports: [GiftsCarousel],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home{}

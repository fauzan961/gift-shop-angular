import { Component } from '@angular/core';
import { GiftsCarousel } from '../../layout/sections/gifts-carousel/gifts-carousel';
import { Categories } from '../../layout/sections/categories/categories';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [GiftsCarousel, Categories],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home{
  constructor(private router: Router){}

  onShopClick(){
  this.router.navigate(['/products']);
  }
}

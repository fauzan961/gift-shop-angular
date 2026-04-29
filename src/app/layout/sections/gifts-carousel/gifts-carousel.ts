import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

interface Gift {
  id: number;
  title: string;
  author: string;
  price: string;
  imageUrl: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-gifts-carousel',
  imports: [CommonModule],
  templateUrl: './gifts-carousel.html',
  styleUrl: './gifts-carousel.css',
})
export class GiftsCarousel implements AfterViewInit{
  constructor(private router: Router){}
  @ViewChild('giftsContainer') giftsContainer!: ElementRef;
  @Input() title: string = '';
  // @Input() gifts: any[] = [];
   gifts: Gift[] = [
      {
        id: 1,
        title: 'صناعة المحتوى والاعلانات بالذكاء الاصطناعي - المستوى..',
        author: 'By Abdullatif Jaber Algharaballi',
        price: '25 KWD',
        imageUrl: 'gradient-1',
        isFavorite: false
      },
      {
        id: 2,
        title: 'تصميم فيديوهات باستخدام الذكاء الاصطناعي',
        author: 'By Abbas Khaled Al-ghadban',
        price: '12 KWD',
        imageUrl: 'gradient-2',
        isFavorite: false
      },
      {
        id: 3,
        title: 'Shift Ai صناعة المحتوى بالذكاء الاصطناعي',
        author: 'By Abdulrahman Alkhamis',
        price: '10 KWD',
        imageUrl: 'gradient-3',
        isFavorite: false
      },
      {
        id: 4,
        title: 'الذكاء الاصطناعي لتحسين أداء الموظف',
        author: 'By Mona Al-otaibi',
        price: '15 KWD',
        imageUrl: 'gradient-4',
        isFavorite: false
      },
      {
        id: 4,
        title: 'الذكاء الاصطناعي لتحسين أداء الموظف',
        author: 'By Mona Al-otaibi',
        price: '28 KWD',
        imageUrl: 'gradient-5',
        isFavorite: false
      },
         {
        id: 4,
        title: 'الذكاء الاصطناعي لتحسين أداء الموظف',
        author: 'By Mona Al-otaibi',
        price: '8 KWD',
        imageUrl: 'gradient-6',
        isFavorite: false
      }
    ];
  
    showLeftArrow = false;
    showRightArrow = true;
  
    ngAfterViewInit() {
      this.updateArrowVisibility();
    }
  
    scrollLeft(): void {
      const container = this.giftsContainer.nativeElement;
      const scrollAmount = container.offsetWidth * 1;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      
      setTimeout(() => this.updateArrowVisibility(), 300);
    }
  
    scrollRight(): void {
      const container = this.giftsContainer.nativeElement;
      const scrollAmount = container.offsetWidth * 1;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      setTimeout(() => this.updateArrowVisibility(), 300);
    }
  
    updateArrowVisibility(): void {
      const container = this.giftsContainer?.nativeElement;
      if (!container) return;
  
      this.showLeftArrow = container.scrollLeft > 10;
      this.showRightArrow = 
        container.scrollLeft < (container.scrollWidth - container.offsetWidth - 10);
    }
  
    toggleFavorite(gift: Gift): void {
      gift.isFavorite = !gift.isFavorite;
    }
  
    buyGift(gift: Gift): void {
      console.log('Buying gift:', gift.title);
    }

    productDetails(){
      this.router.navigate(['/product/slug'])
    }

}

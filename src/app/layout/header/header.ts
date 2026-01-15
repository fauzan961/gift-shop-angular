import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  cartItemCount = 0;
  isMobileMenuOpen = false;

  onSearch() {
    console.log('Search clicked');
    // Implement search functionality
  }

  onAccountClick() {
    console.log('Account clicked');
    // Navigate to account page or show login modal
  }

  onCartClick() {
    console.log('Cart clicked');
    // Navigate to cart page
  }

  switchLanguage() {
    console.log('Language switch clicked');
    // Implement language switching between English and Arabic
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }


}

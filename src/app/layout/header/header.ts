import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private router: Router){}

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
    this.router.navigate(['/cart']);
  }

  switchLanguage() {
    console.log('Language switch clicked');
    // Implement language switching between English and Arabic
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }


}

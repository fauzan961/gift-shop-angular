import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(private router: Router){}

  cartItemCount = 0;
  isMobileMenuOpen = false;
  isDropdownOpen = false;
  isHovering = false;
  searchQuery = '';
  isSearchOpen = false;
  isScrolled = false;

  mobileNav = [
    { label: 'Home', link: '/home', icon: '🏠' },
    { label: 'Categories', link: '/categories', icon: '🛍️' },
    { label: 'Occasion', link: '/occasion', icon: '🎈' },
    { label: 'Gifts', link: '/products', icon: '🎁' },
  ];

popularSuggestions = ['roses', 'birthday cake', 'chocolate box', 'perfume gift set', 'teddy bear'];

productSuggestions = [
  { name: 'Red Rose Grand Bouquet', price: '18.500', rating: 5, image: '/assets/images/flowers.jpg' },
  { name: 'Pink Velvet Celebration Cake', price: '14.000', rating: 5, image: '/assets/images/cake.jpg' },
  { name: 'Rose Gold Heart Pendant', price: '32.000', rating: 5, image: '/assets/images/pendant.webp' },
  { name: 'Belgian Chocolate Luxury Box', price: '12.500', rating: 4, image: '/assets/images/chocolates.jpg' },
  ];

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
    this.lockBodyScroll(this.isMobileMenuOpen);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.lockBodyScroll(false);
  }

  private lockBodyScroll(locked: boolean): void {
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 8;
  }

  onSearchInput(): void {
  this.isSearchOpen = this.searchQuery.trim().length > 0;
  // TODO: replace popularSuggestions/productSuggestions with a live call to your search service, debounced
}

onSearchFocus(): void {
  if (this.searchQuery.trim().length > 0) this.isSearchOpen = true;
}

clearSearch(): void {
  this.searchQuery = '';
  this.isSearchOpen = false;
}

selectSuggestion(term: string): void {
  this.searchQuery = term;
  this.onSearchInput();
}

selectProduct(product: any): void {
  this.isSearchOpen = false;
  // navigate to product page
}

showMoreResults(): void {
  this.isSearchOpen = false;
  // navigate to /search?q=... with searchQuery
}

@HostListener('document:click')
closeDropdown(): void {
  this.isSearchOpen = false;
}

}

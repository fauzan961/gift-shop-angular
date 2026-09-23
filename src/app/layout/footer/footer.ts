import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface FooterLink {
  label: string;
  link: string;
}

@Component({
  selector: 'app-footer',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly year = new Date().getFullYear();

  shopLinks: FooterLink[] = [
    { label: 'All gifts', link: '/products' },
    { label: 'Categories', link: '/categories' },
    { label: 'Shop by occasion', link: '/occasion' },
    { label: 'Your wishlist', link: '/wishlist' },
  ];

  occasionLinks: FooterLink[] = [
    { label: 'Birthdays', link: '/occasion' },
    { label: 'Anniversaries', link: '/occasion' },
    { label: 'Weddings', link: '/occasion' },
    { label: "Valentine's Day", link: '/occasion' },
  ];

  email = '';
  subscribed = false;
  emailError = '';

  subscribe(): void {
    const value = this.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      this.emailError = 'Enter a valid email address';
      return;
    }

    console.log('Newsletter signup:', value);
    this.emailError = '';
    this.subscribed = true;
    this.email = '';
    setTimeout(() => (this.subscribed = false), 4000);
  }

  onEmailInput(): void {
    if (this.emailError) this.emailError = '';
  }
}

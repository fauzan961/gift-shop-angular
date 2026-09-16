import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'products', loadComponent: () => import('./pages/products/product-list/product-list').then(m => m.ProductList) },
  { path: 'product/:slug', loadComponent: () => import('./pages/products/product-details/product-details').then(m => m.ProductDetails) },
  { path: 'occasion', loadComponent: () => import('./pages/occasion/occasion').then(m => m.Occasion) },
  { path: 'categories', loadComponent: () => import('./pages/categories/categories').then(m => m.Categories) },
  { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist').then(m => m.Wishlist) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then(m => m.Cart) },
  { path: 'checkout/:id', loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout) },
  { path: '**', redirectTo: 'home' }
];
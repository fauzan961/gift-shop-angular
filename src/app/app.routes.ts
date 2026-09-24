import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'products', loadComponent: () => import('./pages/products/product-list/product-list').then(m => m.ProductList) },
  { path: 'product/:slug', loadComponent: () => import('./pages/products/product-details/product-details').then(m => m.ProductDetails) },
  { path: 'occasion', loadComponent: () => import('./pages/occasion/occasion').then(m => m.Occasion) },
  { path: 'categories', loadComponent: () => import('./pages/categories/categories').then(m => m.Categories) },
  { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist').then(m => m.Wishlist) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then(m => m.Cart) },
  { path: 'orders', canActivate: [authGuard],
    data: { authReason: 'Sign in to see your orders.', authFallback: '/home' },
    loadComponent: () => import('./pages/orders/orders').then(m => m.Orders) },
  { path: 'checkout/:id', canActivate: [authGuard],
    data: { authReason: 'Please sign in to complete your order.', authFallback: '/cart' },
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout) },
  { path: '**', redirectTo: 'home' }
];
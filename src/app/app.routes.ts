import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Cart } from './pages/cart/cart';
import { ProductList } from './pages/products/product-list/product-list';
import { Occasion } from './pages/occasion/occasion';
import { Categories } from './pages/categories/categories';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'home', component: Home},
    {path: 'cart', component: Cart},
    {path: 'products', component: ProductList},
    {path: 'occasion', component: Occasion},
    {path: 'categories', component: Categories},
];

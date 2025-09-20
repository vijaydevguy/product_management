import { Routes } from '@angular/router';
import { FormComponent } from '../app/FormComponent/form';
import { ProductsComponent } from './ProductsComponent/products';

export const routes: Routes = [
  //before we redirected to form now we are redirecting form based

  // { path: 'form', component: FormComponent },
  // { path: '', redirectTo: 'form', pathMatch: 'full' },
  // { path: '**', redirectTo: 'form',pathMatch: 'full' },

  { path: 'signin', component: FormComponent, data: { mode: 'signin' } },
  { path: 'signup', component: FormComponent, data: { mode: 'signup' } },
  { path: 'products', component: ProductsComponent},
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: '**', redirectTo: 'signin' },
];

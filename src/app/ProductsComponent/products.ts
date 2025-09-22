import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/service';
import { ProductModalComponent } from './product/product';

// we are getting data's from firebase through product.service.ts
import { Product, ProductService } from './product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductModalComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class ProductsComponent implements OnInit {
  //authentication flows
  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService
  ) {}

  logout() {
    this.authService
      .signOut()
      .then(() => this.router.navigate(['/signin']))
      .catch((err) => console.error('Logout failed:', err));
  }

  // firebase api functionalities

  // loading state
  loading = false;

  // product array
  products: Product[] = [];

  editProduct: Product | null = null; // for edit

  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedProduct: Product | null = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;

        // checking data is coming or now
        // console.log("data: " ,data)
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading = false;
      },
    });
  }

  async deleteProduct(product: Product) {
    if (!product.id) return; // safety guard

    const confirmDelete = confirm(
      `Are you sure you want to delete "${product.name}"?`
    );
    if (!confirmDelete) return;

    try {
      await this.productService.deleteProduct(product.id);
      console.log('Deleted:', product.name);
      this.loadProducts(); // reload after delete
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  // this is the state we are tracking modal is opened or not form product component
  isModalOpen = false;

  openModal(mode: 'add' | 'edit' | 'view', product?: Product) {
    this.isModalOpen = true;
    this.modalMode = mode;
    this.selectedProduct = product || null;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
    // after closing modal we will reload page again
    this.loadProducts();
  }
}

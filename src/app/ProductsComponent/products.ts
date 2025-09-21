import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/service';
import { ProductModalComponent } from './product/product';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductModalComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class ProductsComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService
      .signOut()
      .then(() => this.router.navigate(['/signin']))
      .catch((err) => console.error('Logout failed:', err));
  }

  // this is the state we are tracking modal is opened or not form product component
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}

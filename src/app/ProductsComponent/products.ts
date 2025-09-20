import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
}

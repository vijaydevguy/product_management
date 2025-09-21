// product/product-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product.html',
})
export class ProductModalComponent {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  productForm: FormGroup;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      isActive: [true],
      imageUrl: [''],
    });
  }

  close() {
    this.closed.emit();
    this.productForm.reset({ isActive: true });
    this.imagePreview = null;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      //we are fixing file imageUrl as a file later we will send as url
      this.productForm.patchValue({ imageUrl: file });

      //   below code we will use to show image
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Form Data:', this.productForm.value);
      this.close(); // close after submit
    }
  }
}

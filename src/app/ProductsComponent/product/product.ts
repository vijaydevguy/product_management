// product/product-modal.component.ts
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../product.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product.html',
})
export class ProductModalComponent {
  // we are getting form input from products.html
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() product: Product | null = null;

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  // these are stated for FormData,file,uploading status etc
  productForm: FormGroup;
  imagePreview: string | null = null;
  file: File | null = null; // <-- store selected file here
  uploading = false;

  constructor(
    private fb: FormBuilder,
    // private storage: AngularFireStorage,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      isActive: [true],
      // this is will throw an error so we are resolving
      // link: [null],
      link: [null, this.mode === 'add' ? Validators.required : []],
    });
  }

  // here we are handling from front end file and show image logic
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file = file;

      // show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;

        // if file changed we are updating validation errors
        this.productForm.get('link')?.setValue(this.imagePreview);
        this.productForm.get('link')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // When modal opens in edit mode, prefill form and preview
    if (this.mode === 'edit' && this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        isActive: this.product.isActive,
        link: this.product.link ?? null,
      });
      // show existing image as preview (if any)
      this.imagePreview = this.product.link ?? null;
      // don't force file to be required in edit mode (keep existing image if user doesn't upload new)

      // remove required validator in edit mode
      this.productForm.get('link')?.clearValidators();
      this.productForm.get('link')?.updateValueAndValidity();
    }

    // When switching to add mode, reset
    if (this.mode === 'add') {
      this.productForm.reset({ isActive: true });
      this.imagePreview = null;
      this.file = null;

      // here are handling validators
      this.productForm.get('link')?.setValidators([Validators.required]);
      this.productForm.get('link')?.updateValueAndValidity();
    }
  }

  close() {
    this.closed.emit();
    this.productForm.reset({ isActive: true });
    this.imagePreview = null;
  }

  // async onSubmit() {
  //   // these lines just for testing purpose
  //   if (this.productForm.valid) {
  //     console.log('Form Data:', this.productForm.value);
  //     this.close(); // close after submit
  //   } else {
  //     this.productForm.markAllAsTouched(); //show all errors
  //   }
  // }

  // throught this onSubmit function we are handling add and edit
  async onSubmit() {
    // if this will work when too many attempt to click button it will executed
    if (this.uploading) return; // prevent double clicks

    if (this.productForm.valid) {
      // after all validation we are starting loading flag true
      this.uploading = true;

      const formData = this.productForm.value;

      // storing imageUrl that will came form cloudinary
      let imageUrl: string | null = null;

      // if we uploaded any file we are stroing in cloudinary and got url
      if (this.file) {
        try {
          // prepare formData for Cloudinary
          const data = new FormData();
          data.append('file', this.file);
          data.append('upload_preset', environment.cloudinary.uploadPreset);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`,
            {
              method: 'POST',
              body: data,
            }
          );

          const fileData = await res.json();
          imageUrl = fileData.secure_url;
          console.log('Uploaded Image:', imageUrl);
        } catch (err) {
          console.error('Image upload failed:', err);
        }
      }

      const product: Product = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        link: imageUrl ?? '',
        // link will be injected by service (hardcoded for now)
      };

      // here we are calling firebase storing service
      try {
        if (this.mode === 'add') {
          await this.productService.addProduct(product as Product);
          console.log('Product added successfully');
        } else if (this.mode === 'edit' && this.product?.id) {
          await this.productService.updateProduct(this.product.id, product);
          console.log('Product updated successfully');
        }
        this.close();
      } catch (error) {
        console.error('Error saving product:', error);
      } finally {
        // if it is error or on success we are enable to button to do action
        this.uploading = false;
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}

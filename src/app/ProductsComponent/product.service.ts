import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

export interface Product {
  // id we need to update and delete
  id?: string;
  name: string;
  description: string;
  link?: string;
  isActive: boolean;
  //   imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private firestore: Firestore) {}

  // fetching all products
  getProducts(): Observable<Product[]> {
    // collection if through angular firebase it will retrieve products collection
    const productsRef = collection(this.firestore, 'products');

    // collectoin Data will return as javascript object
    return collectionData(productsRef, { idField: 'id' }) as Observable<
      Product[]
    >;
  }

  // //   adding data using firebase and image using firestore
  // addProduct(product: Product) {
  //   const productsRef = collection(this.firestore, 'products');
  //   return addDoc(productsRef, product);
  // }

  // add product with hardcoded image link
  async addProduct(product: Product): Promise<void> {
    try {
      const productsRef = collection(this.firestore, 'products');
      await addDoc(productsRef, {
        ...product,
        // hardcoded link for now
        // link: 'https://via.placeholder.com/150',
      });
      console.log('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  // Edit product
  //Partial product will return that particular object as well we will update that object only
  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const productRef = doc(this.firestore, `products/${id}`);
    console.log(productRef);
    await updateDoc(productRef, { ...product });
  }

  // Delete product
  // Delete product
  async deleteProduct(id: string): Promise<void> {
    const productRef = doc(this.firestore, `products/${id}`);
    await deleteDoc(productRef);
  }
}

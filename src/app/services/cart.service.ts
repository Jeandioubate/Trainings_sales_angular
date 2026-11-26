import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CartItem } from '../model/cart_item.model';
import { Training } from '../model/training.model';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class CartService {

  private storageKey = 'cart';
  private cartItems: CartItem[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
    }    
  }

  //  Charger depuis le localStorage
  private loadCart(): void {
    if (isPlatformBrowser(this.platformId)) return;

    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.cartItems = JSON.parse(data);
    }
  }

  //  Sauvegarder
  private saveCart(): void {
    if (isPlatformBrowser(this.platformId))
      
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
  }

  //  Récupérer le panier
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  //  Ajouter au panier depuis une formation
  addToCart(training: Training, quantity: number): void {
    const existing = this.cartItems.find(
      item => item.id === training.id
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cartItems.push({
        id: training.id,
        name: training.name,
        price: training.price,
        quantity
      });
    }

    this.saveCart();
  }

  //  Modifier la quantité
  updateQuantity(id: number, quantity: number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  //  Supprimer un article
  removeItem(id: number): void {
    this.cartItems = this.cartItems.filter(i => i.id !== id);
    this.saveCart();
  }

  //  Vider le panier
  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem(this.storageKey);
  }

  //  Total du panier
  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartItem } from '../model/cart_item.model';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {

   /**items: Training[] = [];*/
  items: CartItem[] = [];
  total = 0;
  orderValidated = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.items = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  updateQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.id, item.quantity);
    this.refresh();
  }

  removeItem(id: number): void {
    this.cartService.removeItem(id);
    this.refresh();
  }

  clear(): void {
    this.cartService.clearCart();
    this.items = [];
    this.total = 0;
  }

  validateOrder(): void {
    this.cartService.clearCart();
    this.orderValidated = true;
    this.refresh();
  }

  commander(): void {
    
    if (this.items.length === 0) {
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/order']);
  }

}

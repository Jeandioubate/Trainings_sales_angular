import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Customer } from '../model/customer.model';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css',
})
export class OrderForm implements OnInit {

  orderForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //  Accès réservé aux utilisateurs connectés
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);

      return;
    }

    this.orderForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
      ]
    ],
    phone: ['', Validators.required],
    address: ['', Validators.required]
  });

  }

  submitOrder(): void {
    if (this.orderForm.invalid) return;

    if (this.cartService.getCartItems().length === 0) {
      alert('Votre panier est vide');
      return;
    }

    const customer: Customer = this.orderForm.value as Customer;

    const order = {
      customer,
      items: this.cartService.getCartItems(),
      total: this.cartService.getTotal(),
      createdAt: new Date()
    };

    console.log('Commande validée', order);

    this.cartService.clearCart();
    this.router.navigate(['/']);
  }
}

import { Routes } from '@angular/router';
import { Trainings } from './trainings/trainings';
import { Cart } from './cart/cart';
import { OrderForm } from './order-form/order-form';
import { NotFound } from './not-found/not-found';
import { Login } from './login/login';



export const routes: Routes = [
    {path: 'trainings', component: Trainings },
    {path: 'cart', component: Cart },
    {path: 'order', component: OrderForm },
    {path: 'login', component: Login },      
    {path: '', redirectTo: 'trainings', pathMatch: 'full'},
    {path: '**', component: NotFound}
];

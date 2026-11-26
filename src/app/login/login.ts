import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {

    loginForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    isAdminLogin = false;

  ngOnInit(): void {

    this.loginForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    ]],
    password: ['', Validators.required]
  });
  }

  error = '';

  submit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    const success = this.authService.login(email!, password!);

    if (!success) {
      this.error = 'Email ou mot de passe incorrect';
      return;
    }

    const user = this.authService.getAuthenticatedUser();

  //  ADMIN → trainings avec droits admin
    if (user?.roles.includes('ADMIN')) {
      this.router.navigate(['/trainings']);
      return;
  }

  // 👤 USER classique
    this.router.navigate(['/order']);
}

/*
login(): void {
  const { email, password } = this.loginForm.value;

  const success = this.authService.login(email!, password!);

  if (!success) {
    this.error = 'Identifiants incorrects';
    return;
  }

  this.router.navigate(['/trainings']);

  console.log('LOGIN OK'); //

  this.router.navigate(['/cart']);

  console.log(this.authService.getAuthenticatedUser());
}*/

}

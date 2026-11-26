import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })

export class AuthService {

  private users = [
    { email: 'elbad@gmail.com', password: '1234', roles: ['ADMIN', 'USER'] },
    { email: 'hugo@gmail.com',  password: '1234', roles: ['USER'] }
  ];

  /*private authenticatedUser: any = null;*/

  constructor(private storage: StorageService) {}

  login(email: string, password: string): boolean {
  const user = this.users.find(
    u => u.email === email && u.password === password);

  if (!user) return false;


  this.storage.setEncrypted('auth_user', {
    email: user.email,
    roles: user.roles
  });

  return true;
}

getAuthenticatedUser(): any | null {
    return this.storage.getDecrypted<{
      email: string;
      roles: string[];

    }>('auth_user');
  }

logout(): void {
    this.storage.remove('auth_user');
  }

isAuthenticated(): boolean {
  return !!this.getAuthenticatedUser();
  }

hasRole(role: string): boolean {
  const user = this.getAuthenticatedUser();
  return user?.roles?.includes(role);
  }

isAdmin(): boolean {
  return this.hasRole('ADMIN');
  }

}

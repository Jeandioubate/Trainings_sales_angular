import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import CryptoJS from 'crypto-js';



@Injectable({ providedIn: 'root' })
export class StorageService {

  private secretKey = 'SECRET_KEY'; 

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setEncrypted(key: string, data: any): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey
    ).toString();

    localStorage.setItem(key, encrypted);
  }

  getDecrypted<T>(key: string): T | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    const decrypted = CryptoJS.AES.decrypt(encrypted, this.secretKey).toString(
      CryptoJS.enc.Utf8
    );

    return JSON.parse(decrypted) as T;
  }

  remove(key: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(key);
  }
}

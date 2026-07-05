import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomGeneratorService {

  constructor() { }

  generateRandomString(options?: {
    strLength?: number,
    allowLetters?: boolean,
    allowNumbers?: boolean,
    allowSpecialChars?: boolean,
    format?: string,
    transform?: 'uppercase' | 'lowercase'
  }): string {
    options = options || {};
    const { strLength, allowLetters, allowNumbers, allowSpecialChars, format, transform } = options;

    if (format) {
      return this.generateRandomStringFromFormat(format, transform);
    }

    let charset = '';

    if (allowLetters !== false) {
      charset += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }

    if (allowNumbers !== false) {
      charset += '0123456789';
    }

    if (allowSpecialChars) {
      charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';
    }

    if (!charset) {
      throw new Error('At least one type of character (letters, numbers, or special characters) must be allowed.');
    }

    const length = strLength || this.getRandomLength();

    let result = '';
    for (let i = 0; i < length; i++) {
      const charType = charset.charAt(Math.floor(Math.random() * charset.length));
      result += charType;
    }

    return this.transformString(result, transform);
  }

  private getRandomLength(): number {
    return Math.floor(Math.random() * 10) + 1; // Longitud aleatoria entre 1 y 10
  }

  private generateRandomStringFromFormat(format: string, transform: 'uppercase' | 'lowercase'): string {
    let result = '';
    for (let i = 0; i < format.length; i++) {
      if (format[i] === 'L') {
        result += this.getRandomLetter();
      } else if (format[i] === '0') {
        result += this.getRandomNumber();
      } else if (format[i] === 'S') {
        result += this.getRandomSpecialChar();
      } else {
        result += format[i];
      }
    }
    return this.transformString(result, transform);
  }

  private transformString(str: string, transform: 'uppercase' | 'lowercase'): string {
    if (transform === 'uppercase') {
      return str.toUpperCase();
    } else if (transform === 'lowercase') {
      return str.toLowerCase();
    } else {
      return str;
    }
  }

  private getRandomLetter(): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }

  private getRandomNumber(): string {
    return Math.floor(Math.random() * 10).toString();
  }

  private getRandomSpecialChar(): string {
    const charset = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }
}

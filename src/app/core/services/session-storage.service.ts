import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {
    setItem(key: string, value: string): void {
        return sessionStorage.setItem(key, value);
    }

    getItem(key: string): string | null {
        return sessionStorage.getItem(key);
    }

    removeItem(key: string): void {
        return sessionStorage.removeItem(key);
    }
}

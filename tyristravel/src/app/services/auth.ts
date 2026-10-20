import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export type Usuario = {
  id_usuario: number;
  nombre: string;
  email: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost/tyristravel_api';
  private key = 'tyristravel_user';
  private isBrowser: boolean;

  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.userSubject.next(this.readUser());
    }
  }

  login(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios/login.php`, { email, password }).pipe(
      tap((user) => {
        if (this.isBrowser) localStorage.setItem(this.key, JSON.stringify(user));
        this.userSubject.next(user);
      })
    );
  }

  register(nombre: string, email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios/registro.php`, { nombre, email, password }).pipe(
      tap((user) => {
        if (this.isBrowser) localStorage.setItem(this.key, JSON.stringify(user));
        this.userSubject.next(user);
      })
    );
  }

  logout(): void {
    if (this.isBrowser) localStorage.removeItem(this.key);
    this.userSubject.next(null);
  }

  getUser(): Usuario | null {
    return this.userSubject.value;
  }

  getUserId(): number | null {
    return this.userSubject.value?.id_usuario ?? null;
  }

  private readUser(): Usuario | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }
}

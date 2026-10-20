import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class Login {
  email = '';
  password = '';
  cargando = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  submit(): void {
    this.error = '';
    this.cargando = true;
    this.cdr.detectChanges();

    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.cdr.detectChanges();
        this.router.navigateByUrl('/reservas');
      },
      error: () => {
        this.error = 'Email o contraseña incorrectos';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}

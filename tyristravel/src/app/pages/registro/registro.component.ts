import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class Registro {
  nombre = '';
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

    this.auth.register(this.nombre.trim(), this.email.trim(), this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.cdr.detectChanges();
        this.router.navigateByUrl('/reservas');
      },
      error: (err: any) => {
        const msg = err?.error?.error || 'No se pudo registrar el usuario';
        this.error = msg;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}

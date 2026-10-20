import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinosService } from '../../services/destinos';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export class Reservas implements OnInit {
  reservas: any[] = [];
  cargando = true;
  error = '';

  constructor(
    private destinosService: DestinosService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.cargar(), 0);
  }

  private cargar(): void {
    const id_usuario = this.auth.getUserId();

    if (!id_usuario) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();

    this.destinosService.getReservas(id_usuario).subscribe({
      next: (data: any[]) => {
        this.reservas = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'No se pudieron cargar las reservas.';
        this.cargando = false;
        console.log(err);
        this.cdr.detectChanges();
      }
    });
  }

  getImagen(r: any): string {
    const url = r?.destino_imagen_url;
    if (!url) return '/assets/portada.png';
    const s = String(url);
    if (s.startsWith('http')) return s;
    if (s.startsWith('/assets/')) return s;
    return `/assets/${s}`;
  }

  estadoClass(estado: any): string {
    const e = (estado || '').toLowerCase();
    if (e.includes('confirm')) return 'ok';
    if (e.includes('cancel')) return 'bad';
    return 'pending';
  }

cancelar(id_reserva: number): void {
  this.destinosService.cancelarReserva(id_reserva).subscribe({
    next: () => {
      this.reservas = this.reservas.map(r =>
        r.id_reserva === id_reserva ? { ...r, estado: 'cancelada' } : r
      );
      this.cdr.detectChanges();
    },
    error: (err: any) => console.log(err)
  });
}

  borrar(id_reserva: number): void {
  this.destinosService.borrarReserva(id_reserva).subscribe({
    next: () => {
      this.reservas = this.reservas.filter(r => r.id_reserva !== id_reserva);
      this.cdr.detectChanges();
    },
    error: (err: any) => console.log(err)
  });
}

esCancelada(r: any): boolean {
  return String(r?.estado ?? '').trim().toLowerCase().includes('cancel');
}


}

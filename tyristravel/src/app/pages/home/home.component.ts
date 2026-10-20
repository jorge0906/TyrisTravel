import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DestinosService } from '../../services/destinos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class Home implements OnInit {
  destacados: any[] = [];
  topRecomendados: any[] = [];
  cargando = true;

  q = '';
  categoria = '';
  presupuesto = '';

  constructor(
    private destinosService: DestinosService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargando = true;

    this.destinosService.getDestinos().subscribe({
      next: (res: any) => {
        const lista = Array.isArray(res) ? res : (res?.data ?? []);

        this.destacados = lista.slice(0, 3);

        this.topRecomendados = [...lista]
          .sort((a: any, b: any) => Number(b.valoracion ?? 0) - Number(a.valoracion ?? 0))
          .slice(0, 3);

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (e: any) => {
        console.log('Error destinos:', e);
        this.destacados = [];
        this.topRecomendados = [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  buscar(): void {
    const queryParams: any = {};

    const q = this.q.trim();
    if (q) queryParams.q = q;
    if (this.categoria) queryParams.cat = this.categoria;
    if (this.presupuesto) queryParams.budget = this.presupuesto;

    this.router.navigate(['/destinos'], { queryParams });
  }

  getImagen(d: any): string {
    const url = String(d?.imagen_url ?? '').trim();
    if (!url) return '/assets/portada.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/assets/')) return url;
    return `/assets/${url}`;
  }
}

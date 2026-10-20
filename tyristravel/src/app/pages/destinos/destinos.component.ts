import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DestinosService } from '../../services/destinos';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-destinos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './destinos.component.html',
  styleUrls: ['./destinos.component.css'],
})
export class Destinos implements OnInit {
destinos: any[] = [];
destinosFiltrados: any[] = [];
categorias: { id: number; nombre: string }[] = [];
categoriaSeleccionada: number | null = null;
  cargando = true;
  error = '';

  constructor(private destinosService: DestinosService, private cdr: ChangeDetectorRef,   private route: ActivatedRoute) {}

  ngOnInit(): void {
  this.route.queryParamMap.subscribe(params => {
    const q = (params.get('q') ?? '').toLowerCase().trim();
    const cat = (params.get('cat') ?? '').toLowerCase().trim();
    const budget = params.get('budget') ?? '';

    this.cargar(q, cat, budget);
  });
}


 private cargar(q = '', cat = '', budget = ''): void {
  this.cargando = true;
  this.error = '';
  this.cdr.detectChanges();

  this.destinosService.getDestinos().subscribe({
    next: (data: any[]) => {
  this.destinos = data;

  this.categorias = Array.from(
    new Map(
      data
        .filter(d => d.id_categoria != null && d.categoria)
        .map(d => [Number(d.id_categoria), { id: Number(d.id_categoria), nombre: String(d.categoria) }])
    ).values()
  ).sort((a, b) => a.nombre.localeCompare(b.nombre));

  let lista = [...data];

  if (q) {
    lista = lista.filter(d =>
      String(d.nombre ?? '').toLowerCase().includes(q) ||
      String(d.descripcion ?? '').toLowerCase().includes(q) ||
      String(d.ciudad ?? '').toLowerCase().includes(q) ||
      String(d.pais ?? '').toLowerCase().includes(q)
    );
  }

  if (cat) {
    lista = lista.filter(d => String(d.categoria ?? '').toLowerCase() === cat);
  }

  if (budget) {
    lista = lista.filter(d => {
      const p = Number(d.precio ?? 0);
      if (budget === '0-500') return p <= 500;
      if (budget === '500-1000') return p > 500 && p <= 1000;
      if (budget === '1000-2000') return p > 1000 && p <= 2000;
      if (budget === '2000+') return p > 2000;
      return true;
    });
  }

  this.destinosFiltrados = lista;

  this.cargando = false;
  this.cdr.detectChanges();
},

    error: (err: any) => {
      this.error = 'No se pudieron cargar los destinos.';
      this.cargando = false;
      console.log(err);
      this.cdr.detectChanges();
    }
  });
}


 filtrar(): void {
  if (this.categoriaSeleccionada == null) {
    this.destinosFiltrados = this.destinos;
    return;
  }

  const catId = Number(this.categoriaSeleccionada);

  this.destinosFiltrados = this.destinos.filter(d => {
    return Number(d.id_categoria) === catId;
  });
}

  getImagen(d: any): string {
    const url = String(d?.imagen_url ?? '').trim();
    if (!url) return '/assets/portada.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/assets/')) return url;
    return `/assets/${url}`;
  }
}

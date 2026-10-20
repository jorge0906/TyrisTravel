import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DestinosService } from '../../services/destinos';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-detalle-destino',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-destino.component.html',
  styleUrls: ['./detalle-destino.component.css'],
})
export class DetalleDestino implements OnInit {
  destino: any = null;
  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private destinosService: DestinosService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.cargar(), 0);
  }

  getImagen(): string {
    if (!this.destino || !this.destino.imagen_url) return '/assets/portada.png';
    const url = String(this.destino.imagen_url);
    if (url.startsWith('http')) return url;
    if (url.startsWith('/assets/')) return url;
    return `/assets/${url}`;
  }

  private cargar(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Destino no válido.';
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.error = '';
    this.cdr.detectChanges();

    this.destinosService.getDestinoById(id).subscribe({
      next: (data: any) => {
        this.destino = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'No se pudo cargar el destino.';
        this.cargando = false;
        console.log(err);
        this.cdr.detectChanges();
      }
    });
  }

reservar(): void {
  const id_usuario = this.auth.getUserId();
  const id_destino = this.destino?.id_destino;

  if (!id_usuario) {
    alert('Inicia sesión para reservar');
    return;
  }

  if (!id_destino) return;

  this.destinosService.crearReserva(id_usuario, id_destino).subscribe({
    next: () => alert('Reserva creada'),
    error: (err: any) => console.log(err),
  });
}


 


}

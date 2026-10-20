import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DestinosService {
  private baseUrl = 'http://localhost/tyristravel_api';

  constructor(private http: HttpClient) {}

  getDestinos() {
    return this.http.get<any[]>(`${this.baseUrl}/destinos/getDestinos.php`);
  }

  getDestinoById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/destinos/getDestinoById.php?id=${id}`);
  }



crearReserva(id_usuario: number, id_destino: number) {
  return this.http.post<{ message: string; id_reserva: number }>(
    `${this.baseUrl}/reservas/createReserva.php`,
    { id_usuario, id_destino }
  );
}

getReservas(id_usuario: number) {
  return this.http.get<any[]>(
    `${this.baseUrl}/reservas/getReservas.php?id_usuario=${id_usuario}`
  );
}

cancelarReserva(id_reserva: number) {
  return this.http.post(`${this.baseUrl}/reservas/cancelarReserva.php`, { id_reserva });
}

borrarReserva(id_reserva: number) {
  return this.http.post(`${this.baseUrl}/reservas/borrarReserva.php`, { id_reserva });
}


}

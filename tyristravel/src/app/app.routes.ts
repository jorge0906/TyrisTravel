import { Routes } from '@angular/router';


import { Home } from './pages/home/home.component';
import { Destinos } from './pages/destinos/destinos.component';
import { DetalleDestino } from './pages/detalle-destino/detalle-destino.component';
import { Reservas } from './pages/reservas/reservas.component';
import { Login } from './pages/login/login.component';
import { Registro } from './pages/registro/registro.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout';
import { LayoutComponent } from './layouts/layout/layout';

export const routes: Routes = [

  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', component: Home }
    ]
  },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'destinos', component: Destinos },
      { path: 'destinos/:id', component: DetalleDestino },
      { path: 'reservas', component: Reservas },
      { path: 'login', component: Login },
      { path: 'registro', component: Registro }
    ]
  }

];

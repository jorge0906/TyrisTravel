import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../core/footer/footer.component';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './home-layout.html'
})
export class HomeLayoutComponent {}

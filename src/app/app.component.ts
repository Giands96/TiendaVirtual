import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterModule, RouterOutlet,NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tiendavirtual';
}

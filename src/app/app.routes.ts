import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },  // Ruta por defecto
  { path: 'home', component: HomePageComponent, title: 'Home Page' },
  { path: 'explore', component: ExplorePageComponent, title: 'Explore Page' },
];
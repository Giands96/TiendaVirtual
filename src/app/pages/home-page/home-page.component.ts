import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Products } from '../../interfaces/products';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  currentIndex = 0;
  autoSliderInterval: any;
  featuredProducts: Products[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe((products) => {
      this.featuredProducts = products;
    });

    // Iniciar el temporizador para el carrusel automático
    this.autoSliderInterval = setInterval(() => {
      this.next();
    }, 3000); // Cambia cada 3 segundos
  }

  ngOnDestroy() {
    // Limpiar el temporizador al destruir el componente
    clearInterval(this.autoSliderInterval);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.featuredProducts.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.featuredProducts.length) % this.featuredProducts.length;
  }

  viewProduct(productId: number): void {
    console.log("Ver producto con ID:", productId);
    
  }

  viewCategory(category: string): void {
    console.log("Ver productos de la categoría:", category);
    
  }

  setIndex(index: number): void {
    this.currentIndex = index;
  }

}
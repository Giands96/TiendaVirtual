import { Component, OnInit,OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('productCarousel', { static: false }) productCarousel!: ElementRef;
  currentIndex = 0;
  autoSliderInterval: any;
  featuredProducts: Products[] = [];
  products: Products [] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe((products) => {
      this.featuredProducts = products;
    });
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
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

  nextGeneral() {
    const carousel = this.productCarousel.nativeElement;
    const cardWidth = 300 + 24;
    carousel.scrollLeft += cardWidth;
  
    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
      // Reinicia al inicio
      carousel.scrollLeft = 0;
    }
  }
  
  prevGeneral() {
    const carousel = this.productCarousel.nativeElement;
    const cardWidth = 300 + 10;
    carousel.scrollLeft -= cardWidth;
  
    if (carousel.scrollLeft <= 0) {
      // Reinicia al final
      carousel.scrollLeft = carousel.scrollWidth;
    }
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
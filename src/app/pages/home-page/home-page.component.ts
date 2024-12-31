import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  currentIndex = 0;
  autoSliderInterval: any;


  products = [
    {
      id: 1,
      name: 'Logitech G502X+',
      price: 50,
      category: 'Accesorios de PC',
      image: 'assets/g502x-plus-w-2.jpg',
    },
    {
      id: 2,
      name: 'Teclado Mecánico',
      price: 120,
      category: 'Accesorios de PC',
      image: 'https://example.com/keyboard.jpg',
    },
    {
      id: 3,
      name: 'Monitor 4K',
      price: 300,
      category: 'Componentes de PC',
      image: 'https://example.com/monitor.jpg',
    },
  ];

  ngOnInit() {
    // Configurar temporizador automático
    this.autoSliderInterval = setInterval(() => {
      this.next();
    }, 5000); // Cambia cada 5 segundos
  }

  ngOnDestroy() {
    // Limpiar el temporizador al destruir el componente
    clearInterval(this.autoSliderInterval);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.products.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.products.length) % this.products.length;
  }

  setIndex(index: number) {
    this.currentIndex = index;
  }

  // Funciones de botones
  viewProduct(id: number) {
    console.log('Ver producto con ID:', id);
  }

  viewCategory(category: string) {
    console.log('Ver productos de la categoría:', category);
  }

  featuredProducts = [
    {
      id: 1,
      name: 'Silla Minimalista',
      category: 'Exclusive',
      description: 'Diseño ergonómico y moderno para tu espacio de trabajo.',
      price: 120,
      image: 'assets/silla-minimalista.jpg',
    },
    {
      id: 2,
      name: 'Mesa de Madera',
      category: 'Sleek Interiors',
      description: 'Mesa elegante de madera sólida para cualquier ambiente.',
      price: 250,
      image: 'assets/mesa-madera.jpg',
    },
    {
      id: 3,
      name: 'Lámpara Moderna',
      category: 'Chic Simplicity',
      description: 'Iluminación moderna con un toque minimalista.',
      price: 75,
      image: 'assets/lampara-moderna.jpg',
    },
  ];
  
}
import { Component, NgModule } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Products } from '../../interfaces/products';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-explore-page',
  imports: [CommonModule,FormsModule],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.css'
})
export class ExplorePageComponent {
  products: Products[] = [];
  filteredProducts: Products[] = [];
  categories: string[] = [];
  selectedCategory: string = '';

  constructor(private productService: ProductService) {}



  ngOnInit() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
    });

    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    if (category === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => product.categoria_nombre === category);
    }
  }
}

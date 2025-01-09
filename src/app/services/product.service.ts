import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products } from '../interfaces/products';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(this.apiUrl);
  }

  getFeaturedProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(`${this.apiUrl}/destacados`);
  }

  getCategories(): Observable<string[]> {
    return this.getProducts().pipe(
      map((products: Products[]) => {
        const categories = products.map(product => product.categoria_nombre);
        return Array.from(new Set(categories)); 
      })
    );
  }
}
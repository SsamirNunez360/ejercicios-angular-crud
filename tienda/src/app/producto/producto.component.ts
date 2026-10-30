import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-producto',
  styleUrl: './producto.component.css',
  templateUrl: './producto.component.html',
})
export class ProductoComponent implements OnInit {
  productos: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('sesionTienda')) {
      this.router.navigate(['/login']);
      return;
    }

    const guardados = localStorage.getItem('productosTienda');
    if (guardados) {
      this.productos = JSON.parse(guardados);
    } else {
      this.productos = [
        { id: 1, codigo: 'P001', nombre: 'Cuaderno', precio: 35.50, existencias: 20 },
        { id: 2, codigo: 'P002', nombre: 'Lápiz', precio: 8.00, existencias: 0 }
      ];
      localStorage.setItem('productosTienda', JSON.stringify(this.productos));
    }
  }

  cerrarSesion() {
    localStorage.removeItem('sesionTienda');
    this.router.navigate(['/login']);
  }
}

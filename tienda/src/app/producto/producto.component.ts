import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-producto',
  styleUrl: './producto.component.css',
  templateUrl: './producto.component.html',
})
export class ProductoComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('sesionTienda')) {
      this.router.navigate(['/login']);
      return;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('sesionTienda');
    this.router.navigate(['/login']);
  }
}

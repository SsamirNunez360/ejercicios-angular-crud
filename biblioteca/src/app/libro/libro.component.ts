import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-libro',
  styleUrl: './libro.component.css',
  templateUrl: './libro.component.html',
})
export class LibroComponent implements OnInit {
  libros: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('sesionBiblioteca')) {
      this.router.navigate(['/login']);
      return;
    }

    const guardados = localStorage.getItem('librosBiblioteca');
    if (guardados) {
      this.libros = JSON.parse(guardados);
    } else {
      // Registros ficticios iniciales
      this.libros = [
        { id: 1, codigo: '0001', titulo: 'Introducción a la Web', autor: 'Ana Ejemplo', anio: 2022 },
        { id: 2, codigo: '0002', titulo: 'Fundamentos de HTML', autor: 'Luis Ejemplo', anio: 2024 }
      ];
      localStorage.setItem('librosBiblioteca', JSON.stringify(this.libros));
    }
  }

  cerrarSesion() {
    localStorage.removeItem('sesionBiblioteca');
    this.router.navigate(['/login']);
  }
}
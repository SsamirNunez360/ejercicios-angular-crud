import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-libro',
  styleUrl: './libro.component.css',
  templateUrl: './libro.component.html',
})
export class LibroComponent implements OnInit {
  libros: any[] = [];
  libro = { codigo: '', titulo: '', autor: '', anio: null as number | null };
  error = '';
  editandoId: number | null = null;

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
      this.libros = [
        { id: 1, codigo: '0001', titulo: 'Introducción a la Web', autor: 'Ana Ejemplo', anio: 2022 },
        { id: 2, codigo: '0002', titulo: 'Fundamentos de HTML', autor: 'Luis Ejemplo', anio: 2024 }
      ];
      this.persistir();
    }
  }

  guardar() {
    if (!this.validar()) return;
    
    if (this.editandoId === null) {
      // Modo creación
      const id = this.libros.length ? Math.max(...this.libros.map(l => l.id)) + 1 : 1;
      this.libros.push({
        id,
        codigo: this.libro.codigo.trim(),
        titulo: this.libro.titulo.trim(),
        autor: this.libro.autor.trim(),
        anio: Number(this.libro.anio)
      });
    } else {
      // Modo actualización (mantiene mismo ID y misma cantidad)
      const index = this.libros.findIndex(l => l.id === this.editandoId);
      if (index !== -1) {
        this.libros[index] = {
          id: this.editandoId,
          codigo: this.libro.codigo.trim(),
          titulo: this.libro.titulo.trim(),
          autor: this.libro.autor.trim(),
          anio: Number(this.libro.anio)
        };
      }
    }

    this.persistir();
    this.cancelar();
  }

  editar(l: any) {
    this.editandoId = l.id;
    this.libro = {
      codigo: l.codigo,
      titulo: l.titulo,
      autor: l.autor,
      anio: l.anio
    };
    this.error = '';
  }

  cancelar() {
    this.editandoId = null;
    this.limpiar();
  }

  eliminar(id: number) {
    if (!confirm('¿Está seguro de eliminar este registro del catálogo?')) {
      return; // Cancelar conserva la fila
    }

    this.libros = this.libros.filter(l => l.id !== id);
    this.persistir();

    if (this.editandoId === id) {
      this.cancelar();
    }
  }

  validar(): boolean {
    if (!this.libro.codigo.trim() || !this.libro.titulo.trim() || !this.libro.autor.trim()) {
      this.error = 'Código, título y autor son campos obligatorios y no pueden ser solo espacios.';
      return false;
    }

    const a = Number(this.libro.anio);
    if (this.libro.anio === null || !Number.isInteger(a) || a < 1000 || a > 9999) {
      this.error = 'El año debe ser un número entero de 4 cifras (entre 1000 y 9999).';
      return false;
    }

    this.error = '';
    return true;
  }

  limpiar() {
    this.libro = { codigo: '', titulo: '', autor: '', anio: null };
    this.error = '';
  }

  persistir() {
    localStorage.setItem('librosBiblioteca', JSON.stringify(this.libros));
  }

  cerrarSesion() {
    localStorage.removeItem('sesionBiblioteca');
    this.router.navigate(['/login']);
  }
}
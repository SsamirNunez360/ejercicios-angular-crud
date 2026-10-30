import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-producto',
  styleUrl: './producto.component.css',
  templateUrl: './producto.component.html',
})
export class ProductoComponent implements OnInit {
  productos: any[] = [];
  producto = {
    codigo: '',
    nombre: '',
    precio: null as number | null,
    existencias: null as number | null,
  };
  error = '';
  editandoId: number | null = null;

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
      this.persistir();
    }
  }

  guardar() {
    if (!this.validar()) return;

    if (this.editandoId === null) {
      // Modo creación
      const id = this.productos.length ? Math.max(...this.productos.map(p => p.id)) + 1 : 1;
      this.productos.push({
        id,
        codigo: this.producto.codigo.trim(),
        nombre: this.producto.nombre.trim(),
        precio: Number(this.producto.precio),
        existencias: Number(this.producto.existencias),
      });
    } else {
      // Modo actualización (conserva el mismo ID y cantidad de registros)
      const index = this.productos.findIndex(p => p.id === this.editandoId);
      if (index !== -1) {
        this.productos[index] = {
          id: this.editandoId,
          codigo: this.producto.codigo.trim(),
          nombre: this.producto.nombre.trim(),
          precio: Number(this.producto.precio),
          existencias: Number(this.producto.existencias),
        };
      }
    }

    this.persistir();
    this.cancelar();
  }

  editar(p: any) {
    this.editandoId = p.id;
    this.producto = {
      codigo: p.codigo,
      nombre: p.nombre,
      precio: p.precio,
      existencias: p.existencias,
    };
    this.error = '';
  }

  cancelar() {
    this.editandoId = null;
    this.limpiar();
  }

  eliminar(id: number) {
    if (!confirm('¿Está seguro de eliminar este producto del inventario?')) {
      return; // Cancelar conserva la fila
    }

    this.productos = this.productos.filter(p => p.id !== id);
    this.persistir();

    if (this.editandoId === id) {
      this.cancelar();
    }
  }

  validar(): boolean {
    if (!this.producto.codigo.trim() || !this.producto.nombre.trim()) {
      this.error = 'El código y el nombre son obligatorios y no pueden ser solo espacios.';
      return false;
    }

    const p = Number(this.producto.precio);
    if (this.producto.precio === null || isNaN(p) || p <= 0) {
      this.error = 'El precio debe ser un número mayor que cero (admite decimales).';
      return false;
    }

    const e = Number(this.producto.existencias);
    if (this.producto.existencias === null || !Number.isInteger(e) || e < 0) {
      this.error = 'Las existencias deben ser un número entero mayor o igual a cero.';
      return false;
    }

    this.error = '';
    return true;
  }

  limpiar() {
    this.producto = { codigo: '', nombre: '', precio: null, existencias: null };
    this.error = '';
  }

  persistir() {
    localStorage.setItem('productosTienda', JSON.stringify(this.productos));
  }

  cerrarSesion() {
    localStorage.removeItem('sesionTienda');
    this.router.navigate(['/login']);
  }
}

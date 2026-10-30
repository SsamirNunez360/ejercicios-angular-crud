import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-mascota',
  styleUrl: './mascota.component.css',
  templateUrl: './mascota.component.html',
})
export class MascotaComponent implements OnInit {
  mascotas: any[] = [];
  mascota = {
    nombre: '',
    especie: '',
    edad: null as number | null,
    propietario: '',
  };
  error = '';
  editandoId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('sesionVeterinaria')) {
      this.router.navigate(['/login']);
      return;
    }

    const guardados = localStorage.getItem('mascotasVeterinaria');
    if (guardados) {
      this.mascotas = JSON.parse(guardados);
    } else {
      this.mascotas = [
        { id: 1, nombre: 'Luna', especie: 'Gato', edad: 0, propietario: 'Ana Ejemplo' },
        { id: 2, nombre: 'Rocky', especie: 'Perro', edad: 3, propietario: 'Luis Ejemplo' }
      ];
      this.persistir();
    }
  }

  guardar() {
    if (!this.validar()) return;

    if (this.editandoId === null) {
      const id = this.mascotas.length ? Math.max(...this.mascotas.map(m => m.id)) + 1 : 1;
      this.mascotas.push({
        id,
        nombre: this.mascota.nombre.trim(),
        especie: this.mascota.especie.trim(),
        edad: Number(this.mascota.edad),
        propietario: this.mascota.propietario.trim(),
      });
    } else {
      // Actualización: conserva mismo ID y misma cantidad de registros
      const index = this.mascotas.findIndex(m => m.id === this.editandoId);
      if (index !== -1) {
        this.mascotas[index] = {
          id: this.editandoId,
          nombre: this.mascota.nombre.trim(),
          especie: this.mascota.especie.trim(),
          edad: Number(this.mascota.edad),
          propietario: this.mascota.propietario.trim(),
        };
      }
    }

    this.persistir();
    this.cancelar();
  }

  editar(m: any) {
    this.editandoId = m.id;
    this.mascota = {
      nombre: m.nombre,
      especie: m.especie,
      edad: m.edad,
      propietario: m.propietario,
    };
    this.error = '';
  }

  cancelar() {
    this.editandoId = null;
    this.limpiar();
  }

  eliminar(id: number) {
    if (!confirm('¿Está seguro de eliminar esta mascota del registro?')) {
      return; // Cancelar conserva la fila
    }
    this.mascotas = this.mascotas.filter(m => m.id !== id);
    this.persistir();
    if (this.editandoId === id) {
      this.cancelar();
    }
  }

  validar(): boolean {
    if (!this.mascota.nombre.trim() || !this.mascota.especie.trim() || !this.mascota.propietario.trim()) {
      this.error = 'Nombre, especie y propietario son obligatorios y no pueden ser solo espacios.';
      return false;
    }

    const e = Number(this.mascota.edad);
    if (this.mascota.edad === null || !Number.isInteger(e) || e < 0) {
      this.error = 'La edad debe ser un número entero mayor o igual a cero.';
      return false;
    }

    this.error = '';
    return true;
  }

  limpiar() {
    this.mascota = { nombre: '', especie: '', edad: null, propietario: '' };
    this.error = '';
  }

  persistir() {
    localStorage.setItem('mascotasVeterinaria', JSON.stringify(this.mascotas));
  }

  cerrarSesion() {
    localStorage.removeItem('sesionVeterinaria');
    this.router.navigate(['/login']);
  }
}

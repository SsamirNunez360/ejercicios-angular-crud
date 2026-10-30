import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  selector: 'app-estudiante',
  styleUrl: './estudiante.component.css',
  templateUrl: './estudiante.component.html',
})
export class EstudianteComponent implements OnInit {
  estudiantes: any[] = [];
  estudiante = {
    cuenta: '',
    nombre: '',
    carrera: '',
    fechaIngreso: '',
  };
  error = '';
  editandoId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('sesionEstudiantes')) {
      this.router.navigate(['/login']);
      return;
    }

    const guardados = localStorage.getItem('registrosEstudiantes');
    if (guardados) {
      this.estudiantes = JSON.parse(guardados);
    } else {
      this.estudiantes = [
        { id: 1, cuenta: '0000001', nombre: 'Ana Ejemplo', carrera: 'Ingeniería en Sistemas', fechaIngreso: '2026-09-14' },
        { id: 2, cuenta: '0000002', nombre: 'Luis Ejemplo', carrera: 'Administración', fechaIngreso: '2026-09-15' }
      ];
      this.persistir();
    }
  }

  guardar() {
    if (!this.validar()) return;

    if (this.editandoId === null) {
      // Modo creación
      const id = this.estudiantes.length ? Math.max(...this.estudiantes.map(e => e.id)) + 1 : 1;
      this.estudiantes.push({
        id,
        cuenta: this.estudiante.cuenta.trim(),
        nombre: this.estudiante.nombre.trim(),
        carrera: this.estudiante.carrera.trim(),
        fechaIngreso: this.estudiante.fechaIngreso,
      });
    } else {
      // Modo actualización (conserva mismo ID y cantidad)
      const index = this.estudiantes.findIndex(e => e.id === this.editandoId);
      if (index !== -1) {
        this.estudiantes[index] = {
          id: this.editandoId,
          cuenta: this.estudiante.cuenta.trim(),
          nombre: this.estudiante.nombre.trim(),
          carrera: this.estudiante.carrera.trim(),
          fechaIngreso: this.estudiante.fechaIngreso,
        };
      }
    }

    this.persistir();
    this.cancelar();
  }

  editar(e: any) {
    this.editandoId = e.id;
    this.estudiante = {
      cuenta: e.cuenta,
      nombre: e.nombre,
      carrera: e.carrera,
      fechaIngreso: e.fechaIngreso,
    };
    this.error = '';
  }

  cancelar() {
    this.editandoId = null;
    this.limpiar();
  }

  eliminar(id: number) {
    if (!confirm('¿Está seguro de eliminar este estudiante del registro?')) {
      return; // Cancelar conserva la fila
    }

    this.estudiantes = this.estudiantes.filter(e => e.id !== id);
    this.persistir();

    if (this.editandoId === id) {
      this.cancelar();
    }
  }

  validar(): boolean {
    if (!this.estudiante.cuenta.trim() || !this.estudiante.nombre.trim() || !this.estudiante.carrera.trim() || !this.estudiante.fechaIngreso) {
      this.error = 'Todos los campos (cuenta, nombre, carrera y fecha de ingreso) son obligatorios.';
      return false;
    }

    this.error = '';
    return true;
  }

  limpiar() {
    this.estudiante = { cuenta: '', nombre: '', carrera: '', fechaIngreso: '' };
    this.error = '';
  }

  persistir() {
    localStorage.setItem('registrosEstudiantes', JSON.stringify(this.estudiantes));
  }

  cerrarSesion() {
    localStorage.removeItem('sesionEstudiantes');
    this.router.navigate(['/login']);
  }
}

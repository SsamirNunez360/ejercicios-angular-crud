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

    const id = this.estudiantes.length ? Math.max(...this.estudiantes.map(e => e.id)) + 1 : 1;
    this.estudiantes.push({
      id,
      cuenta: this.estudiante.cuenta.trim(),
      nombre: this.estudiante.nombre.trim(),
      carrera: this.estudiante.carrera.trim(),
      fechaIngreso: this.estudiante.fechaIngreso,
    });

    this.persistir();
    this.limpiar();
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

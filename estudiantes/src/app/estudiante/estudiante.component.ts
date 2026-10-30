import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-estudiante',
  styleUrl: './estudiante.component.css',
  templateUrl: './estudiante.component.html',
})
export class EstudianteComponent implements OnInit {
  estudiantes: any[] = [];

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
      localStorage.setItem('registrosEstudiantes', JSON.stringify(this.estudiantes));
    }
  }

  cerrarSesion() {
    localStorage.removeItem('sesionEstudiantes');
    this.router.navigate(['/login']);
  }
}

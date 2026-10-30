import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-estudiante',
  styleUrl: './estudiante.component.css',
  templateUrl: './estudiante.component.html',
})
export class EstudianteComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('sesionEstudiantes')) {
      this.router.navigate(['/login']);
      return;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('sesionEstudiantes');
    this.router.navigate(['/login']);
  }
}

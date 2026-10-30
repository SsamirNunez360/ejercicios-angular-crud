import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-mascota',
  styleUrl: './mascota.component.css',
  templateUrl: './mascota.component.html',
})
export class MascotaComponent implements OnInit {
  mascotas: any[] = [];

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
      localStorage.setItem('mascotasVeterinaria', JSON.stringify(this.mascotas));
    }
  }

  cerrarSesion() {
    localStorage.removeItem('sesionVeterinaria');
    this.router.navigate(['/login']);
  }
}

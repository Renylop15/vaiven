import { Component } from '@angular/core';
// 1. Importamos la clase con el nombre simplificado
import { Hero } from './components/hero/hero.component';
import { Info } from './components/info/info.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Agregamos el componente al arreglo
  imports: [Hero,Info], 
  templateUrl: './app.component.html'
})
// 3. Renombramos la clase principal a 'App' para que coincida con main.ts
export class App {
  title = 'vaiven-landing';
}
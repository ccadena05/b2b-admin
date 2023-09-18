import { ElementRef, Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class LayoutService {

   constructor() { }

   // Esta función determina el número de columnas en un diseño de cuadrícula y la separación entre ellas (gap) en función del ancho de un elemento HTML (`el`).
   // Aplica una clase CSS adecuada (`grid-cols-1`, `grid-cols-2` o `grid-cols-3`) según el ancho del elemento.
   grid(el: HTMLFormElement) {
      return 'grid gap-x-6 w-full ' + (this.width(el) <= 640 ? 'grid-cols-1' : this.width(el) > 640 && this.width(el) < 768 ? 'grid-cols-2' : 'grid-cols-3'
      );
   }

   // Similar a la función `grid`, esta función se encarga de la gestión de cuadrículas, pero se limita a dos columnas (`grid-cols-1` o `grid-cols-2`) en función del ancho de pantalla.
   half_grid(el: HTMLFormElement) {
      return 'grid gap-x-6 ' + (this.width(el) <= 768 ? 'grid-cols-1' : 'grid-cols-2');
   }

   // Esta función gestiona la propiedad `col-span` en un diseño de cuadrícula.
   // Dependiendo del ancho del elemento HTML, aplica una clase CSS (`col-span-1`, `col-span-2` o `col-span-3`) que controla cuántas columnas del diseño de cuadrícula debe abarcar un elemento.
   full(el: HTMLFormElement) {
      return this.width(el) <= 640 ? 'col-span-1' : this.width(el) > 640 && this.width(el) < 768 ? 'col-span-2' : 'col-span-3';
   }

   // Esta función devuelve el ancho (`offsetWidth`) del elemento HTML pasado como argumento.
   width(el: HTMLFormElement) {
      return el.offsetWidth;
   }

}

import { Component, ElementRef, Input, OnInit, Renderer2, SimpleChange, SimpleChanges } from '@angular/core';


@Component({
   selector: 'icon',
   templateUrl: './icon.component.html',
   styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
   constructor(private el: ElementRef, private renderer: Renderer2) {
   }

   ngOnInit(): void {
   }

   ngOnChanges(changes: SimpleChanges) {
   }

   ngAfterViewInit() {
      const iconName = this.el.nativeElement.textContent.trim();
      this.renderer.setStyle(this.el.nativeElement, 'background-image', `url('assets/icons/${iconName}.svg')`);
      this.renderer.setStyle(this.el.nativeElement, 'background-size', 'contain');
      this.renderer.setStyle(this.el.nativeElement, 'background-repeat', 'no-repeat');
      this.renderer.setStyle(this.el.nativeElement, 'background-cover', 'contain');
      this.renderer.setStyle(this.el.nativeElement, 'color', 'transparent');
      this.renderer.setStyle(this.el.nativeElement, 'max-width', '1.5rem');
   }

}

import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  @ViewChild('car') car!: ElementRef;

  constructor(
    public lang: LanguageService,

    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { 
    console.log(data);
    
  }

  ngOnInit(): void {
  }

  prev() {
    this.car.nativeElement.scrollBy(-(this.car.nativeElement.scrollWidth / 4), 0)

 }
 next() {
    this.car.nativeElement.scrollBy(this.car.nativeElement.scrollWidth / 4, 0)
 }

}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitaionesComponent } from './capacitaiones.component';

describe('CapacitaionesComponent', () => {
  let component: CapacitaionesComponent;
  let fixture: ComponentFixture<CapacitaionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacitaionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacitaionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

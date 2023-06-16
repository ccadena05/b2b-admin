import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent implements OnInit {

  products: any = [
    {
      '01_NOMBRE': 'Caretas con diadema inyectada Modelo CCtr',
      '02_DESCRIPCIÓN BREVE': 'Careta protectora ante contingencia COVID19.',
      '03_DESCRIPCIÓN DETALLADA': 'Una careta protectora es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante la contingencia del COVID-19. Está diseñada para cubrir la cara completa y se usa comúnmente en combinación con otros equipos de protección personal, como mascarillas faciales y guantes, para proporcionar una protección adicional contra el virus.'
    },
    {
      '01_NOMBRE': 'Careta con soporte Modelo FKI',
      '02_DESCRIPCIÓN BREVE': 'Careta con diadema inyectada, fabricada en PET transparente, reutilizable y sanitizable.',
      '03_DESCRIPCIÓN DETALLADA': 'La careta con diadema inyectada es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante situaciones como la pandemia del COVID-19.'
    },
    {
      '01_NOMBRE': 'Mascarilla Termoformada Modelo MC',
      '02_DESCRIPCIÓN BREVE': 'Mascarilla termoformada, fabricada en PET transparente, reutilizable y sanitizable.',
      '03_DESCRIPCIÓN DETALLADA': 'La mascarilla termoformada es un tipo de mascarilla facial que se utiliza como equipo de protección personal durante situaciones como la pandemia del COVID-19. Está fabricada en PET transparente, lo que permite una visibilidad clara sin comprometer la seguridad de la persona que la usa.'
    },
    {
      '01_NOMBRE': 'Caretas con diadema inyectada Modelo CCtr',
      '02_DESCRIPCIÓN BREVE': 'Careta protectora ante contingencia COVID19.',
      '03_DESCRIPCIÓN DETALLADA': 'Una careta protectora es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante la contingencia del COVID-19. Está diseñada para cubrir la cara completa y se usa comúnmente en combinación con otros equipos de protección personal, como mascarillas faciales y guantes, para proporcionar una protección adicional contra el virus.'
    },
    {
      '01_NOMBRE': 'Careta con soporte Modelo FKI',
      '02_DESCRIPCIÓN BREVE': 'Careta con diadema inyectada, fabricada en PET transparente, reutilizable y sanitizable.',
      '03_DESCRIPCIÓN DETALLADA': 'La careta con diadema inyectada es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante situaciones como la pandemia del COVID-19.'
    },
    {
      '01_NOMBRE': 'Mascarilla Termoformada Modelo MC',
      '02_DESCRIPCIÓN BREVE': 'Mascarilla termoformada, fabricada en PET transparente, reutilizable y sanitizable.',
      '03_DESCRIPCIÓN DETALLADA': 'La mascarilla termoformada es un tipo de mascarilla facial que se utiliza como equipo de protección personal durante situaciones como la pandemia del COVID-19. Está fabricada en PET transparente, lo que permite una visibilidad clara sin comprometer la seguridad de la persona que la usa.'
    },
    {
      '01_NOMBRE': 'Caretas con diadema inyectada Modelo CCtr',
      '02_DESCRIPCIÓN BREVE': 'Careta protectora ante contingencia COVID19.',
      '03_DESCRIPCIÓN DETALLADA': 'Una careta protectora es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante la contingencia del COVID-19. Está diseñada para cubrir la cara completa y se usa comúnmente en combinación con otros equipos de protección personal, como mascarillas faciales y guantes, para proporcionar una protección adicional contra el virus.'
    },
    {
      '01_NOMBRE': 'Careta con soporte Modelo FKI',
      '02_DESCRIPCIÓN BREVE': 'Careta con diadema inyectada, fabricada en PET transparente, reutilizable y sanitizable.',
      '03_DESCRIPCIÓN DETALLADA': 'La careta con diadema inyectada es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante situaciones como la pandemia del COVID-19.'
    },
    {
      '01_NOMBRE': 'Mascarilla Termoformada Modelo MC',
      '02_DESCRIPCIÓN BREVE': 'Mascarilla termoformada, fabricada en PET transparente, reutilizable y sanitizable.',
      '03_DESCRIPCIÓN DETALLADA': 'La mascarilla termoformada es un tipo de mascarilla facial que se utiliza como equipo de protección personal durante situaciones como la pandemia del COVID-19. Está fabricada en PET transparente, lo que permite una visibilidad clara sin comprometer la seguridad de la persona que la usa.'
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

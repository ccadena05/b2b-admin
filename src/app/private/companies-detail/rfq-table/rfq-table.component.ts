import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rfq-table',
  templateUrl: './rfq-table.component.html',
  styleUrls: ['./rfq-table.component.scss']
})
export class RfqTableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  requierements = [
    {
      '01_TITULO': 'Titulo del Requerimiento',
      '02_DESCRIPCION': 'Descripción del Requerimiento',
      '03_FECHA': '2023-06-10'
    },
    {
      '01_TITULO': 'Titulo del Requerimiento',
      '02_DESCRIPCION': 'Descripción del Requerimiento',
      '03_FECHA': '2023-06-10'
    },
    {
      '01_TITULO': 'Titulo del Requerimiento',
      '02_DESCRIPCION': 'Descripción del Requerimiento',
      '03_FECHA': '2023-06-10'
    },
    {
      '01_TITULO': 'Titulo del Requerimiento',
      '02_DESCRIPCION': 'Descripción del Requerimiento',
      '03_FECHA': '2023-06-10'
    },
    {
      '01_TITULO': 'Titulo del Requerimiento',
      '02_DESCRIPCION': 'Descripción del Requerimiento',
      '03_FECHA': '2023-06-10'
    },
    {
      '01_TITULO': 'Titulo del Requerimiento',
      '02_DESCRIPCION': 'Descripción del Requerimiento',
      '03_FECHA': '2023-06-10'
    },
    {
      '01_TITULO': 'Titulo del Requerimiento',
      '02_DESCRIPCION': 'Descripción del Requerimiento',
      '03_FECHA': '2023-06-10'
    },
    {
      '01_TITULO': 'Titulo del Requerimiento',
      '02_DESCRIPCION': 'Descripción del Requerimiento',
      '03_FECHA': '2023-06-10'
    },
  ]

}

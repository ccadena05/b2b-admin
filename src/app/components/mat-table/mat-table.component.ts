import { LiveAnnouncer } from '@angular/cdk/a11y';
import { KeyValuePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OutputService } from 'src/app/services/output.service';

@Component({
   selector: 'app-mat-table',
   templateUrl: './mat-table.component.html',
   styleUrls: ['./mat-table.component.scss'],
})
export class MatTableComponent implements OnInit, OnChanges {
   columns: any = [];
   displayedColumns: any = [];
   matchStrings = /ID|id/
   sort: any;
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) set matSort(ms: MatSort) {
      this.sort = ms;
      this.dataSource.sort = this.sort;
   }

   @Input() dataToDisplay: any = [];
   @Input() action!: (row: any) => void;
   dataSource!: MatTableDataSource<any>;
   datos: any = [];
   img: any[] = [];
   table_ready: boolean = false;
   values = [0, 1, 2, 3, '0', '1', '2', '3'];

   rfq: any = {
      1: {
         color: '#16a34a',
         icon: 'check',
         hex: '#dcfce7'
      },
      2: {
         color: '#d97706',
         icon: 'ellipsis',
         hex: '#fef3c7'
      },
      3: {
         color: '#dc2626',
         icon: 'lock',
         hex: '#fee2e2'
      },
   }

   apd: any = {
      0: {
         icon: 'eye-slash',
         color: '#dc2626',
         hex: '#fee2e2'

      },
      1: {
         icon: 'eye',
         hex: '#cce5ff',
         color: '#0076ef'

      }
   }

   randomPaddings: string[] = [];


   constructor(
      private _liveAnnouncer: LiveAnnouncer,
      private keyvalue: KeyValuePipe,
      private router: Router,
      private dialog: MatDialog,
      private output: OutputService
   ) {
      this.generateRandomPaddings();
      this.output.table_ready.subscribe(
         (ready) => this.table_ready = ready
      )
   }

   ngOnInit(): void {

   }

   ngOnChanges(changes: SimpleChanges) {

      this.columns = this.datos = [];
      if (changes['dataToDisplay']) {
         // this.displayedColumns = this.renderTable(changes['dataToDisplay'].currentValue)
         this.renderTable(changes['dataToDisplay'].currentValue).then((data) => {
            this.displayedColumns = data;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            if (data.length > 0) {
               this.output.table_ready.next(true);
            }
         })
      }
   }

   ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

   }

   applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement)?.value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource?.paginator) {
         this.dataSource?.paginator.firstPage();
      }
   }

   announceSortChange({ sortState }: { sortState: Sort; }) {
      if (sortState?.direction) {
         this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
         this._liveAnnouncer.announce('Sorting cleared');
      }
   }

   renderTable(data: any): Promise<any> {
      return new Promise<any>((resolve) => {
         this.dataSource = new MatTableDataSource(data);

         if (data && data.length > 0) {
            this.keyvalue.transform(data[0] ?? data[1])?.forEach((column: any, index: any) => {
               this.columns?.push({
                  columnDef: column?.key,
                  header: column?.key.replace(/_/g, " "),
                  cell: (data: any) => `${data[column?.key]}`
               });
            });
         }
         resolve(this.columns?.map((c: any) => c?.columnDef))
      })
   }

   match_date(text: any) {
      return (/^\d{4}-\d{2}-\d{2}$/).test(text)
   }

   generateRandomPaddings(): void {
      for (let i = 0; i < 5; i++) { 
         for (let j = 0; j < 6; j++) {
            const randomPadding = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
            this.randomPaddings.push(`12px ${randomPadding}px`);
         }
      }
   }
}

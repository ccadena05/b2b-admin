import { LiveAnnouncer } from '@angular/cdk/a11y';
import { KeyValuePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
   selector: 'app-mat-table',
   templateUrl: './mat-table.component.html',
   styleUrls: ['./mat-table.component.scss']
})
export class MatTableComponent implements OnInit, OnChanges {
   columns: any = [];
   displayedColumns: any = [];
   matchStrings = /ID|id/
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
   @Input() dataToDisplay: any = [];
   @Input() action!: (row: any) => void;
   dataSource: any = [];
   datos: any = [];
   img: any[] = [];

   constructor(
      private _liveAnnouncer: LiveAnnouncer,
      private keyvalue: KeyValuePipe,
      private router: Router,
      private dialog: MatDialog
   ) {
   }

   ngOnInit(): void {

   }

   ngOnChanges(changes: SimpleChanges) {
      this.columns = this.datos = [];
      if (changes['dataToDisplay'])
         this.displayedColumns = this.renderTable(changes['dataToDisplay'].currentValue)
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

   renderTable(data: any) {
      this.dataSource = new MatTableDataSource(data);

      if(data && data.length > 0){
         this.keyvalue.transform(data[0] ?? data[1])?.forEach((column: any, index: any) => {
         this.columns?.push({
            columnDef: column?.key,
            header: column?.key.replace(/_/g, " "),
            cell: (data: any) => `${data[column?.key]}`
         });
      });
   }

      return this.columns?.map((c: any) => c?.columnDef)
   }
}

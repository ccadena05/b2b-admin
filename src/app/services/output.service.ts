import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutputService {

   // detailObject = new Subject<any>();
   modulo = new Subject<any>();
   ready = new Subject<any>();
   table_ready = new Subject<any>();
   masterSection = new Subject<any>();
   detail = new BehaviorSubject<any>('');

  constructor() { }
}

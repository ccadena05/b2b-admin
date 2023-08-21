import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class LocalStoreService {
   private ls = window.localStorage;
   bread$: Subject<any>;

   constructor() {
      this.bread$ = new Subject();
   }

   public setItem(key: any, value: any) {
      // this.bread$.next(value);
      value = JSON.stringify(value);
      this.ls.setItem(key, value);
      return true;
   }

   public update(key: any, value: any) {
      this.remove(key);
      this.bread$.next(value);
      value = JSON.stringify(value);
      this.ls.setItem(key, value);
      return true;
   }

   public getItem(key: any) {
      let local = this.ls.getItem(key);


      let value = local != null ? JSON.parse(local) : null;
      try {
         return value;
      } catch (e) {
         return null;
      }
   }

   public clear() {
      const openDialog = this.getItem('openDialog');
      this.ls.clear();
      this.setItem('openDialog', openDialog)
   }
   public remove(key: any){
      this.ls.removeItem(key);
   }

   getObs$(): Observable<any> {
      return this.bread$.asObservable();
   }

}

import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription | undefined;

  constructor() { }

  onFirstComponentButtonClick(url: any) {
    this.invokeFirstComponentFunction.emit(url);
  }
}

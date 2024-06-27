import { Component } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls:[ './accordion.component.css']
})
export class AccordionComponent {
  items = ['Survey','survey count','survey taken','Download Questions','Response Download'];

  trackByFn(index: number, item: any): number {
    return index;
  }
}

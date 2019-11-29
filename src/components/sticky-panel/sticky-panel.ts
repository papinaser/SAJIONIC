import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Generated class for the StickyPanelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'sticky-panel',
  templateUrl: 'sticky-panel.html'
})
export class StickyPanelComponent {

  @Input() title: string;
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

}

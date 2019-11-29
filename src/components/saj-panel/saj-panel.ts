import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'saj-panel',
  templateUrl: 'saj-panel.html'
})
export class SajPanelComponent {

  @Input() opened = false;
  @Input() title: string;
  @Input() panelIcon?: string;
  @Input() showConfig=false;
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
  @Output() showConfigClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor() {

  }
  emitShowConfig() {
    if (this.showConfig) {
      this.showConfigClicked.emit();
    }
  }

}


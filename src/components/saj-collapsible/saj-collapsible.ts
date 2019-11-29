import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'saj-collapsible',
  templateUrl: 'saj-collapsible.html'
})
export class SajCollapsibleComponent {

  @Input() active=false;
  @Input() title: string;
  @Input() icon?: string;
  @Input() enable=true;
  @Input() showDetailActions=false;
  @Output() detailActionClicked: EventEmitter<string> = new EventEmitter<string>();

  constructor() {

  }
  taggleActive(){
    this.active=!this.active;
  }

  onDetailActionClick(event,name){
    event.cancelBubble = true;
    if(event.stopPropagation) event.stopPropagation();
    this.detailActionClicked.emit(name);
  }

}

import {Component, Input} from '@angular/core';

@Component({
  selector: 'saj-tap',
  templateUrl: 'saj-tap.html'
})
export class SajTapComponent {

  @Input('tabTitle') title: string;
  @Input() active = false;



}

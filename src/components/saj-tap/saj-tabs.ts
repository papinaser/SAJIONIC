import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit, Output, EventEmitter,
} from '@angular/core';

import { SajTapComponent } from './saj-tap';


@Component({
  selector: 'saj-tabs',
  templateUrl:'saj-tabs.html'
})
export class SajTabsComponent implements AfterContentInit {

  @ContentChildren(SajTapComponent) tabs: QueryList<SajTapComponent>;

  @Output() activeTabChanged: EventEmitter<string> = new EventEmitter<string>();

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);

    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: SajTapComponent){
    // deactivate all tabs
    this.tabs.toArray().forEach((tab,inx,arr) =>
    {
      tab.active = false;
    });

    tab.active = true;

    this.activeTabChanged.emit(tab.title);



  }
}

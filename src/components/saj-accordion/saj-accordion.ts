import {Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter, Input} from '@angular/core';
import { SajPanelComponent } from '../saj-panel/saj-panel';

@Component({
  selector: 'saj-accordion',
  templateUrl: 'saj-accordion.html'
})
export class SajAccordionComponent implements AfterContentInit {
  @ContentChildren(SajPanelComponent) panels: QueryList<SajPanelComponent>;

  @Output() onMinimize: EventEmitter<any> = new EventEmitter<any>();

  @Input() justPanels=false;

  ngAfterContentInit() {
    // Open the first panel
    this.panels.toArray()[0].opened = true;
    // Loop through all panels
    this.panels.toArray().forEach((panel: SajPanelComponent) => {
      // subscribe panel toggle event
      panel.toggle.subscribe(() => {
        // Open the panel
        this.openPanel(panel);
      });
    });
  }

  openPanel(panel: SajPanelComponent) {
    // close all panels
    this.panels.toArray().forEach(p => p.opened = false);
    // open the selected panel
    panel.opened = true;
  }

}

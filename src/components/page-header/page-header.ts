import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DashboardPage} from "../../pages/dashboard/dashboard";
import {NavController} from "ionic-angular";

@Component({
  selector: 'page-header',
  templateUrl: 'page-header.html'
})
export class PageHeaderComponent {

  @Input() showMainMenu=false;
  @Input() pageTitle="";
  @Input() showCloseMenu=false;
  @Output() closeClicked: EventEmitter<any> = new EventEmitter<any>();
  constructor(private navCtrl:NavController) {
  }

  onShowMainMenu(){
    this.navCtrl.setRoot(DashboardPage);
  }

  onCloseClick(){
    this.closeClicked.emit();
  }

}

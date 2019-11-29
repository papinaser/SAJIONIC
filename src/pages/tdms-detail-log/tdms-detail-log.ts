import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Utils} from "../../services/utils";
import {detailLogModel} from "../../models/tdmsLogModel";


@Component({
  selector: 'page-tdms-detail-log',
  templateUrl: 'tdms-detail-log.html',
})
export class TdmsDetailLogPage implements OnInit{

  model:detailLogModel;
  title='';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl:ViewController,
              public util:Utils) {
  }

  ngOnInit(): void {
    this.model= this.navParams.get("model");
    this.title=this.model.title;
  }
  onSubmit(){
    this.viewCtrl.dismiss(this.model.dataSource);
  }

  onBack(){
    this.viewCtrl.dismiss(null);
  }

}

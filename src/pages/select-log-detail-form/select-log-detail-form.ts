import {Component, OnInit, ViewChild} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../providers";
import {Utils} from "../../services/utils";
import {IonicSelectableComponent} from "ionic-selectable";

@Component({
  selector: 'page-select-log-detail-form',
  templateUrl: 'select-log-detail-form.html',
})

export class SelectLogDetailFormPage implements  OnInit{
  @ViewChild('portComponent') portComponent: IonicSelectableComponent;

  roykardConfigs:any;
  setTypeItems:any;
  selectedMRId:number;
  forReport:boolean;
  public selectedRoykard:any;
  public selectedSetTypeItemId:number;
  constructor(private viewCtrl: ViewController,
              private api:Api,
              private util:Utils,
              private navParams: NavParams) {
  }
  ngOnInit(): void {
    this.selectedMRId=this.navParams.get('selectedMRId');
    this.forReport=this.navParams.get('forReport');
    this.setRoykardConfigs();
  }

  isFormValid(){
    return this.selectedRoykard && (!this.forReport || this.selectedSetTypeItemId);
  }

  setRoykardConfigs(){
    let addr="TDMSLogs/GetRoykardConfigs/";
    if(this.forReport){
      addr="TDMSLogs/GetRoykardConfigsForReport/";
    }
    this.api.get(addr+this.selectedMRId).share().subscribe(
      (resp:any)=>{
        //resp= JSON.parse(resp);
        if (resp.result=="200"){
          this.roykardConfigs= resp.message;
          this.portComponent.open();
        }
        else {
          this.util.showToast(resp.message);
        }
      }
    );
  }

  roykardSelected($event){
    this.selectedRoykard=$event.value;
    if (this.forReport){
      this.setSetTypeItems();
    }
    else{
      this.onSubmit();
    }
  }
  onSubmit(){
    if (this.isFormValid()){
      this.viewCtrl.dismiss({selectedRoykard:this.selectedRoykard,selectedSetTypeItemId:this.selectedSetTypeItemId});
    }
  }
  onCancel(){
    this.viewCtrl.dismiss();
  }
  setSetTypeItems(){
    this.api.get("TDMSLogs/GetRoyardConfigLogTypes/"+this.selectedRoykard.value).share()
      .subscribe((resp:any)=>{
        if (resp.result=="200"){
          this.setTypeItems=resp.message;
          if (this.setTypeItems.length==1){
            this.selectedSetTypeItemId= this.setTypeItems[0].value;
          }
        }
        else{
          this.util.showToast(resp.message);
        }
      });
  }

}

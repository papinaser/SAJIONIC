import {Component, Input, OnInit} from '@angular/core';
import {logParam} from "../../models/tdmsLogModel";
import {IDatePickerConfig} from "ng2-jalali-date-picker";
import {Api} from "../../providers";
import {Utils} from "../../services/utils";
import {LogFormModel} from "../../models/powerBi";

/**
 * Generated class for the SajInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'saj-input',
  templateUrl: 'saj-input.html'
})
export class SajInputComponent implements OnInit{

  @Input() model:logParam ;
  @Input() dataSource:any;
  @Input() logFormModel:LogFormModel;
  @Input() token='';
  listItems:any[];
  datePickerConfig:IDatePickerConfig = {
    drops: 'down',
    appendTo:'body',
    format: 'YYYY/MM/DD'
  };
  constructor(private api:Api, private util:Utils,) {

  }
  ngOnInit(): void {
    if(this.model.type=='list'){
      let addr=`TDMSLogs/LookupDataSource/${this.logFormModel.modelRelationId}/${this.logFormModel.roykardId}/${this.model.name}/${this.token}`;
      this.api.get(addr).share().subscribe(
        (resp:any)=>{
          //resp= JSON.parse(resp);
          if (resp.result=="200"){
            this.listItems= resp.message;
          }
          else {
            this.util.showToast(resp.message);
          }
        }
      );
    }
  }

}

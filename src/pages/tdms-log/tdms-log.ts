import {Component, OnInit} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {detailLogModel, logMRModel, logParam, saveDataEntryModel, tdmsLogModel} from "../../models/tdmsLogModel";
import {LogFormModel, treeModel} from "../../models/powerBi";
import {Utils} from "../../services/utils";
import {Api, User} from "../../providers";
import {LoginPage} from "../login/login";
import localText from "../../assets/agGrid/localText";
import {TdmsDetailLogPage} from "../tdms-detail-log/tdms-detail-log";


@Component({
  selector: 'page-tdms-log',
  templateUrl: 'tdms-log.html',
})
export class TdmsLogPage implements OnInit{

  model:LogFormModel;
  tdmsLogInfo:tdmsLogModel;
  logMojodiats:treeModel[];
  showMojodiats=false;
  detailLogTitle="جزئیات لاگ";
  username="";
  pageTitle="ثبت لاگ";
  currentMRParams:logMRModel;
  formIsReadey=0;
  gridTexts:any;
  contextOptions:any;
  gridApi:any;
  pageSize=10;
  columnDefs = [];
  rowData = [];
  defaultColDef:any;
  gridColumnApi :any;
  currentDetailGroupName:string;
  ds:any;

  constructor(public navCtrl:NavController,public navParams:NavParams,
              public api:Api,public viewCtrl:ViewController,
              public modalCtrl:ModalController,
              public util:Utils,public user:User){

  }
  ngOnInit(): void {
    this.user.getCurrentUser().then(userInfo => {
      if (!userInfo || !userInfo.username) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }
      const loading= this.util.showLoading("در حال بارگذاری اطلاعات...");

      this.contextOptions={
        thisComponent:this
      };
      this.gridTexts=localText;
      this.defaultColDef = {
        enableValue: true,
        resizable:true,
        sortable: true,
        filter: true
      };

      this.username = userInfo.username;
      this.logMojodiats = [];
      this.model = this.navParams.get("model");
      this.pageTitle = (this.model.isEditMode ? "ویرایش" : "ثبت" ) + " " + "لاک" + " " + this.model.formName;
      if (this.model.masterLogId){
        this.pageTitle+=" ("+this.model.masterLogId+")";
      }
      let seq = this.api.get("TDMSLogs/InitForEntryLog/" + this.model.modelRelationId + "/" +
        this.model.roykardId + "/"+this.model.masterLogId+ "/" + this.username).share();
      seq.subscribe((resp: any) => {
        if (resp.result == "200") {
          this.tdmsLogInfo = resp.message;
          this.createLogMojodiats();

          this.ds=JSON.parse(JSON.stringify(this.tdmsLogInfo.dataSource));
          this.currentMRParams= this.tdmsLogInfo.mrParams[0];
          this.currentDetailGroupName=this.currentMRParams.groupParams.length? this.currentMRParams.groupParams[0].groupName:'بدون گروه';
          this.detailLogTitle="جزئیات لاگ "+ this.currentMRParams.title;
          this.formIsReadey++;
        } else {
          this.util.showToast(resp.message);
        }
        loading.dismiss();
      });
    });
  }
  formIsValid(){
    return true;
  }


  onCurrentGroupChanged(groupName){
    this.currentDetailGroupName=groupName;
  }
  onDetailActionClicked(action,group){
    if (action==="add" || action==="edit"){
      const model:detailLogModel= {
        title:this.detailLogTitle,
        logFormModel:this.model,
        token:this.username,
        detailFields:group.detailFields,
        groupName:group.groupName,
        groupIndex:group.groupIndex,
        isEditMode:action==='edit',
        dataSource:this.ds["group_"+this.currentMRParams.id+"_"+group.groupIndex]
      };
      const modal = this.modalCtrl.create(TdmsDetailLogPage,{model:model},{cssClass: 'fullScreenModal'});
      modal.present();
      modal.onDidDismiss((resp)=>{
        if (action=='add'){
          //this.ds["group_"+this.currentMRParams.id+"_"+group.groupIndex].push(resp);
        }
        //console.log('resp!!!!!',resp);
      });

    }
  }
  onGridReady(params,group){
    this.gridApi= params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridColDefs(group.detailFields);
    let rows= this.ds["group_"+this.currentMRParams.id+"_"+group.groupIndex];
    if (!rows){
      rows=[];
    }
    this.gridApi.setRowData(rows);
  }
  setGridColDefs(fields:logParam[]){
    let result = [];
    fields.map((fld,inx,arr)=>{
      let newCol= {headerName:fld.title,field:fld.name,colId:fld.id,type:fld.type};
      if (fld.name=="id"){
        newCol["hide"]=true;
      }
      result.push(newCol);

      if (inx==arr.length-1){
        this.gridApi.setColumnDefs(result);
        this.gridColumnApi.autoSizeColumns();
      }
    })
  }
  onPageSizeChanged(size){
    this.gridApi.paginationSetPageSize(Number(size));
  }

  createLogMojodiats(){
    this.logMojodiats=[];
    this.tdmsLogInfo.mrParams.forEach((val,index)=>{
      this.logMojodiats.push(new treeModel(val.id.toString(),val.title,false));
      if (index==this.tdmsLogInfo.mrParams.length-1){
        this.formIsReadey++;
      }
    });
  }

  onSubmit(f:NgForm){
    this.util.showConfirm("ذخیره", "آیا برای ذخیره لاگ مطمئنید؟").then((resp)=>{
      if (resp){
        const loading= this.util.showLoading("در حال ذخیره اطلاعات لاگ");
        const saveModel:saveDataEntryModel={
          dataSource:this.ds,
          initData:this.tdmsLogInfo.dataSource,
          masterLogId:this.model.masterLogId,
          modelRelationId:this.model.modelRelationId,
          logType:this.model.isEditMode?1:0,
          roykardId:this.model.roykardId,
          token:this.username
        };
        let seq = this.api.post("TDMSLogs/SaveLogDataEntry",saveModel);
        seq.subscribe((resp:any)=>{
          loading.dismiss();
          if (resp.result=="200"){
            this.util.showToast("ذخیره سازی با موفقیت انجام شد");
            this.viewCtrl.dismiss(resp.message);
          }
          else{
            this.util.showToast(resp.message);
            console.log(resp.message);
          }
        })

      }
    });
  }

  onBack(){
    this.viewCtrl.dismiss();
  }
  onMojodiatChange(selNode){
    console.log('selNode...',selNode);
    this.detailLogTitle="جزئیات لاگ " + selNode.value;
    this.showMojodiats=false;
    this.currentMRParams= this.tdmsLogInfo.mrParams.find((val)=>{
      return val.id.toString()==selNode.key;
    });
  }

  onDetailLogConfig(){
    this.showMojodiats=!this.showMojodiats;
  }



}

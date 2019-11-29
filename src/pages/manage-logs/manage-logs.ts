import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavController, NavParams, Select, ViewController} from 'ionic-angular';
import {ExcelFormModel, LogFormModel, ManageLogsModel} from "../../models/powerBi";
import {Utils} from "../../services/utils";
import {Api, User} from "../../providers";
import {ExcelFormPage} from "../excel-form/excel-form";
import localText from "../../assets/agGrid/localText";
import {LoginPage} from "../login/login";
import {TdmsLogPage} from "../tdms-log/tdms-log";

@Component({
  selector: 'page-manage-logs',
  templateUrl: 'manage-logs.html',
})
export class ManageLogsPage implements OnInit, OnDestroy{

  @ViewChild("selectPageSize") selectPageSize:Select;
  @ViewChild("selectLogEntryType") selectLogEntryType:Select;

  title="";
  model:ManageLogsModel;
  gridColumnApi :any;
  defaultColDef:any;
  username="";
  gridApi:any;
  pageSize=20;
  columnDefs = [];
  rowData = [];
  gridTexts:any;
  selectedMLId:number;
  contextOptions:any;
  showListType="grid";
  logEntryType=1;
  isEditMode=false;
  constructor(public viewCtrl: ViewController,
              public navCtrl:NavController,
              public util:Utils,
              public user:User,
              public api:Api,
              public modalCtrl:ModalController,
              public navParams: NavParams) {
  }
  onBack(){
    this.viewCtrl.dismiss();
  }

  ngOnInit(): void {
    this.user.getCurrentUser().then((userInfo)=>{
      if (!userInfo || !userInfo.username) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }
      this.contextOptions={
        thisComponent:this
      };

      this.username=userInfo.username;
      this.model = this.navParams.get('model');
      this.title= "ثبت و مدیریت لاگها : " + this.model.roykard.value+ " - "+this.model.modelRelation.value;
      this.gridTexts=localText;
      this.defaultColDef = {
        enableValue: true,
        resizable:true,
        sortable: true,
        filter: true
      };
    });
  }
  ngOnDestroy(): void {
    this.modalCtrl=null;
    this.util=null;
    this.navParams=null;
    this.api=null;
    this.viewCtrl=null;
    this.gridApi=null;
    this.gridColumnApi=null;
    this.model=null;
    this.title=null;
    this.columnDefs=null;
    this.rowData=null;
    this.gridTexts=null;
    this.pageSize=null;
    this.selectedMLId=null;
    this.contextOptions=null;

  }
  taggleListType(){
    if (this.showListType=="grid"){
      this.showListType="list";
    }
    else{
      this.showListType="grid";
    }
  }

  onRefresh(){
    this.initGridDataSource(true);
  }

  onGridReady(params){
    this.gridApi= params.api;
    this.gridColumnApi = params.columnApi;
    this.initGridDataSource();
  }
  initGridDataSource(update:boolean=false){
    let addr="TDMSLogs/InitialLogList/"+this.model.modelRelation.key+"/"+this.model.roykard.value+"/master/0/ALL/"+this.username;

    let seq = this.api.get(addr).share();
    seq.subscribe((resp:any)=>{
      //resp= JSON.parse(resp);
      //TODO:: use setRowData(rows) for 	Set new rows into the grid.
      //updateRowData(transaction)
      if (resp.result=="200"){
        if (update){
          this.gridApi.setRowData(resp.message.rowData);
          this.gridColumnApi.autoSizeColumns();
          //this.gridApi.redrawRows();
        }
        else {
          this.gridApi.setColumnDefs(resp.message.columnDefs);
          this.gridApi.setRowData(resp.message.rowData);
          this.gridColumnApi.autoSizeColumns();
          this.onPageSizeChanged(this.pageSize);
        }
      }
      else{
        this.util.showToast(resp.message);
      }
    })
  }
  getContextMenuItems(params) {
    return [
      {
        name: "ویرایش ",
        icon:"<i class='fa fa-edit'/>",
        action: () => {
          params.context.thisComponent.editLog();
        },
      },
      {
        name: "حذف",
        icon:"<i class='fa fa-trash'/>",
        tooltip: "حذف تمام اطلاعات هدر و جزئیات لاگ به همراه ضمائم",
        action: () => {
          params.context.thisComponent.deleteLog();
        }
      },
      {
        name:"بروزرسانی",
        tooltip:"واکشی مجدد اطلاعات از سرور",
        action:()=>{
          params.constructor.thisComponent.onRefresh();
        }
      },
      "copy"
    ];
  }
  editLog(){
    this.logEntryType=0;
    this.isEditMode=true;
    this.selectLogEntryType.open();
  }
  editLogForm(){
    const formTitle= this.model.roykard.value+" - "+ this.model.modelRelation.value;
    let model = new LogFormModel(formTitle,true,this.model.modelRelation.key,this.model.roykard.value,this.selectedMLId);
    this.navCtrl.push(TdmsLogPage,{model:model});

  }
  editLogExcel(){
    let loading= this.util.showLoading('در حال آماده سازی...');
    let seq = this.api.get("TDMSLogs/ValidateEditLog/"+this.selectedMLId+"/"+this.username).share();
    seq.subscribe((resp:any)=>{
      loading.dismiss();
      if (resp.result=="200"){
        const exlTitle= this.model.roykard.value+" - "+ this.model.modelRelation.value;
        let model = new ExcelFormModel(resp.message,exlTitle,true,this.model.modelRelation.key,this.model.roykard.value,this.selectedMLId);

        let excelForm = this.modalCtrl.create(ExcelFormPage, {model:model},{cssClass:'fullScreenModal'});
        excelForm.onDidDismiss(data => {
          if (data){
            this.initGridDataSource(true);
          }
        });
        excelForm.present();
      }
      else {
        this.util.showToast(resp.message);
      }
    });
  }
  deleteLog(){
    this.util.showConfirm('حذف!!!','آیا برای حذف لاگ مطئنید؟').then(resp=>{
      if (resp){
        let loading= this.util.showLoading('در حال حذف لاگ...');
        let seq = this.api.post("TDMSLogs/DeleteLog/"+this.selectedMLId+"/"+this.username,{}).share();
        seq.subscribe((resp:any)=>{
          loading.dismiss();
          if (resp.result=="200"){
            this.util.showToast(resp.message);
            this.initGridDataSource(true);
          }
          else{
            this.util.showToast(resp.message);
          }
        });
      }
    });

  }

  onPageSizeChanged(size){
    this.gridApi.paginationSetPageSize(Number(size));
  }

  changePageSize(){
    this.selectPageSize.open();
  }
  newLog(){
    this.logEntryType=0;
    this.isEditMode=false;
    this.selectLogEntryType.open();
  }
  onLogEntryTypeChanged(){
    if (this.logEntryType==1){
      if (this.isEditMode){
        this.editLogForm();
      }
      else{
        this.newLogForm();
      }
    }
    else{
      if (this.isEditMode){
        this.editLogExcel();
      }
      else{
        this.newLogExcel();
      }

    }
  }
  newLogForm(){
    const formTitle= this.model.roykard.value+" - "+ this.model.modelRelation.value;
    let model = new LogFormModel(formTitle,false,this.model.modelRelation.key,this.model.roykard.value);
    this.navCtrl.push(TdmsLogPage,{model:model});
  }
  newLogExcel(){
    let seq = this.api.get("TDMSLogs/ValidateNewLog/"+this.model.modelRelation.key+"/"+this.model.roykard.value+"/"
      +this.username).share();
    seq.subscribe((resp:any)=>{
      if (resp.result=="200"){
        const exlTitle= this.model.roykard.value+" - "+ this.model.modelRelation.value;
        let model = new ExcelFormModel(resp.message,exlTitle,false,this.model.modelRelation.key,this.model.roykard.value);

        let excelForm = this.modalCtrl.create(ExcelFormPage, {model:model},{cssClass:'fullScreenModal'});
        excelForm.onDidDismiss(data => {
          if (data){
            this.initGridDataSource(true);
          }
        });
        excelForm.present();
      }
      else {
        this.util.showToast(resp.message);
      }
    });
  }
  onRowSelected($event){
    let selectedRows = this.gridApi.getSelectedRows();
    this.selectedMLId=selectedRows[0].MasterLogId;
  }

}

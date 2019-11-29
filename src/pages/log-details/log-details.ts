import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController,Select} from 'ionic-angular';
import {GetDetailLogReportModel, LogDetailsModel} from "../../models/powerBi";
import {Api, User} from "../../providers";
import {Utils} from "../../services/utils";
import localText from "../../assets/agGrid/localText";
import {LoginPage} from "../login/login";
import {RowNode} from 'ag-grid-community';
import {ShowPdfReportPage} from "../show-pdf-report/show-pdf-report";


@Component({
  selector: 'page-log-details',
  templateUrl: 'log-details.html',
})
export class LogDetailsPage implements OnInit,OnDestroy{
  @ViewChild("selectPageSize") selectPageSize:Select;
  @ViewChild("selectYearFilter") selectYearFilter:Select;

  model:LogDetailsModel;
  gridColumnApi :any;
  defaultColDef:any;
  columnDefs = [];
  rowData = [];
  username="";
  gridApi:any;
  gridTexts:any;
  pageSize=20;
  yearFilter:string;
  yearRange:number[];

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              public api:Api,
              public user:User,
              public modalCtrl:ModalController,
              public navCtrl: NavController,
              public util:Utils) {
  }

  ngOnInit(): void {
    this.user.getCurrentUser().then((userInfo)=>{
      if (!userInfo || !userInfo.username) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }
      const currentYear= this.util.getCurrentDateYear();
      this.yearRange=[];
      for(let i=currentYear; i>currentYear-5;i--){
        this.yearRange.push(i);
      }
      this.yearFilter= currentYear.toString();
      this.username=userInfo.username;
      this.model=this.navParams.get('model');
      this.gridTexts=localText;
      this.defaultColDef = {
        enableValue: true,
        enableRowGroup: true,
        enablePivot: true,
        sortable: true,
        filter: true
      };
    });
  }
  onYearFilterChange(yearFilter){
    this.initGridDataSource(true);
  }
  changeYearFilter(){
    this.selectYearFilter.open();
  }
  ngOnDestroy(): void {
    this.modalCtrl=null;
    this.util=null;
    this.navParams=null;
    this.api=null;
    this.user=null;
    this.viewCtrl=null;
    this.gridApi=null;
    this.gridColumnApi=null;
    this.model=null;
    this.columnDefs=null;
    this.rowData=null;
    this.gridTexts=null;
    this.pageSize=null;

  }
  onBack(){
    this.viewCtrl.dismiss();
  }
  changePageSize(){
    this.selectPageSize.open();
  }
  onGridReady(params){
    this.gridApi= params.api;
    this.gridColumnApi = params.columnApi;
    this.initGridDataSource();
  }
  initGridDataSource(update:boolean=false){
    console.log("Current Filter : ",this.yearFilter);
    const addr="TDMSLogs/InitialLogList/"+this.model.modelReation.key+"/"
      +this.model.roykard.value+"/detail/"+this.model.setTypeItemId+"/"+this.yearFilter+"/"+this.username;
    const seq = this.api.get(addr).share();
    const loading = this.util.showLoading("در حال بارگذاری اطلاعات...");
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
          this.gridApi.redrawRows();
          this.gridColumnApi.autoSizeColumns();
          this.onPageSizeChanged(this.pageSize);
        }
        this.gridApi.closeToolPanel();

      }
      else{
        this.util.showToast(resp.message);
      }
      loading.dismiss();
    })
  }
  onPageSizeChanged(size){
    this.gridApi.paginationSetPageSize(Number(size));
  }
  detailReports(){
    let addr= "TDMSLogs/GetLogFormReports/"+this.model.modelReation.key+"/"
      +this.model.roykard.value+"/"+this.model.setTypeItemId+"/"+this.username;
    const seq = this.api.get(addr).share();
    seq.subscribe((resp:any)=>{
      if (resp.result=="200"){
        this.util.selectModal('انتخاب گزارش',resp.message).then((reportId)=>{
          this.showReport(reportId);
        })
      }
      else{
        this.util.showToast(resp.message);
      }
    });

  }
  showReport(reportId){
    const loading = this.util.showLoading('در حال بارگذاری گزارش');
    let selectedIds:number[]=[];

    this.gridApi.getModel().rowsToDisplay.forEach((row:RowNode,index,rows)=>{
      selectedIds.push(row.data.id);
      if (index==rows.length-1){
        const addr="TDMSLogs/GetDetailLogReport";
        const model= new GetDetailLogReportModel(this.model.modelReation.key,this.model.roykard.value,
          this.model.setTypeItemId,reportId,selectedIds.join("_"),this.username);

        this.api.post(addr,model,{responseType:'arraybuffer'}).subscribe((resp)=>{
          this.navCtrl.push(ShowPdfReportPage,{title:"نمایش گزارش",pdfData:resp});
          loading.dismiss();
        });
      }
    });
  }

  onRowSelected($event){
    //let selectedRows = this.gridApi.getSelectedRows();
    //this.selectedMLId=selectedRows[0].MasterLogId;
  }


}

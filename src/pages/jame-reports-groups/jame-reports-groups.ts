import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {  NavController } from 'ionic-angular';
import {keyValueModel} from "../../models/apiModels";
import {Api, User} from "../../providers";
import {Utils} from "../../services/utils";
import {LoginPage} from "../login/login";
import * as moment from "jalali-moment";
@Component({
  selector: 'page-jame-reports-groups',
  templateUrl: 'jame-reports-groups.html',
})
export class JameReportsGroupsPage implements OnInit{
  @ViewChild("reportViewFrame") frame:ElementRef;

  selectedReport:any;
  //dateFilter:dateRange;
  //getReportUrl:string;
  username:string;
  startDate:any;
  endDate:any;
  maxDate:any;
  today:string;
  showReportState=false;
  screenHeight:any;
  screenWidth:any;
  lastFileURL:any;
  datePickerConfig = {
    drops: 'down',
    format: 'YYYY/MM/DD'
  };
  pageTitle="لیست گزارشات جامع تولید";
  constructor(public navCtrl: NavController,
              public user:User,
              public util:Utils,
              public api:Api) {
  }
  ngOnInit(): void {

    this.user.getCurrentUser().then((userInfo)=>{
      if (!userInfo || !userInfo.username) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }
      this.username = userInfo.username;
      let seq=this.api.get("User/GetCurrentDate").share();
      seq.subscribe((resp:any)=>{
        if (resp.result=="200"){
          this.today=resp.message;
          this.maxDate= moment(this.today,'jYYYY,jMM,jDD');
        }
      });
      this.getScreenSize();
      //this.dateFilter= new dateRange("1396/01/01","1397/10/26");
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }
  // onDateChange(){
  //   this.dateFilter.calculateStartEndDate("dddd DD MMMM YYYY");
  // }

  onCloseReportState(){
    this.frame.nativeElement.src='';
    this.frame.nativeElement.src=this.lastFileURL;
    this.showReportState=false;
    this.pageTitle= "لیست گزارشات جامع تولید";
  }
  onReportSelectted(selNode:keyValueModel){
    this.selectedReport=selNode;
  }
  onInitReport(){
    //let sd = this.dateFilter.stdStartDate.replace("/","_").replace("/","_");
    //let ed= this.dateFilter.stdEndDate.replace("/","_").replace("/","_");
    let sd =this.startDate.format('jYYYY_jMM_jDD');
    let ed= this.endDate.format('jYYYY_jMM_jDD');
    let addr = "JameReports/VerifyGetReport/"+sd+
      "/"+ed+"/"+this.selectedReport.key;

    let seq = this.api.get(addr).share();
    seq.subscribe((resp:any)=>{
      if (resp.result=="200"){
        this.util.showToast('گزارش شما آماده نمایش است...');

        const loading = this.util.showLoading("در حال بارگذاری گزارش...");
        let addr = "/JameReports/GetReport/"+sd+ "/"+ed+"/"+this.selectedReport.key+ "/"+this.username;
        let seq2 = this.api.get(addr,{}, {responseType:'arraybuffer'}).share();
        seq2.subscribe((resp)=> {
          const file = new Blob([resp], {type: 'application/pdf'});
          this.lastFileURL = URL.createObjectURL(file);
          this.frame.nativeElement.src = this.lastFileURL;
          loading.dismiss();
          this.showReportState=true;
          this.frame.nativeElement.style.width="100%";
          this.frame.nativeElement.style.height=(this.screenHeight-85)+"px";
          this.pageTitle="نمایش "+this.selectedReport.value;
        });

      }
      else{
        this.util.showToast(resp.message);
      }
    });
  }
  isFormValid(){
    return (this.selectedReport && !this.selectedReport.treeNode.hasChildren && this.startDate && this.endDate);
  }

}

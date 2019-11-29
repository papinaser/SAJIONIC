import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../providers";

@Component({
  selector: 'page-show-pdf-report',
  templateUrl: 'show-pdf-report.html',
})
export class ShowPdfReportPage implements OnInit, OnDestroy{
  title:string;
  pdfData:any;
  screenHeight:any;
  screenWidth:any;

  @ViewChild("reportViewFrame") frame:ElementRef;
  constructor(public navCtrl: NavController,
              public viewCtrl:ViewController,
              public api:Api,
              public navParams: NavParams) {

  }
  onBack(){
    this.viewCtrl.dismiss();
  }
  ngOnInit(): void {
    this.title= this.navParams.get("title");
    this.pdfData=this.navParams.get("pdfData");
    this.getScreenSize();
  }
  ngOnDestroy(): void {
    this.title=null;
    this.pdfData=null;
    this.screenHeight=null;
    this.screenWidth=null;
  }

  ionViewDidEnter(){
    const file = new Blob([this.pdfData], {type: 'application/pdf'});
    this.frame.nativeElement.src = URL.createObjectURL(file);
    this.frame.nativeElement.style.width="100%";
    this.frame.nativeElement.style.height=(this.screenHeight-85)+"px";
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

}

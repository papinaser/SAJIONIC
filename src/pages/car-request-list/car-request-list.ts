import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {Api, User} from "../../providers";
import {LoginPage} from "../login/login";
import {CarRequestPage} from "../car-request/car-request";


@Component({
  selector: 'page-car-request-list',
  templateUrl: 'car-request-list.html',
})
export class CarRequestListPage implements OnInit{

  canShowGrid=false;
  username="";
  gridApi:any;
  pageSize=15;

  constructor(public navCtrl: NavController,
              public api:Api,
              public user:User,
              public toastCtrl:ToastController,
              public navParams: NavParams) {
  }

  ngOnInit(){
    this.user.getCurrentUser().then((userInfo) =>{
      if (!userInfo || !userInfo.username) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }
      else {
        this.username = userInfo.username;
        this.canShowGrid=true;
      }
    });
  }

  onGridReady(params){
    this.gridApi= params.api;
    let seq = this.api.get("CarRequest/GetUserRequests/"+this.username).share();
    seq.subscribe((resp:any)=>{
      //resp= JSON.parse(resp);
      if (resp.result=="200"){
        this.gridApi.setColumnDefs(resp.message.columnDefs);
        this.gridApi.setRowData(resp.message.rowData);
        this.gridApi.redrawRows();
        this.onPageSizeChanged(this.pageSize);
      }
      else{
        this.showToast(resp.message);
        this.canShowGrid=false;
      }
    })
  }
  addRequest(){
    this.navCtrl.push(CarRequestPage);
  }
  onPageSizeChanged(size){
    this.gridApi.paginationSetPageSize(Number(size));
  }

  showToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarRequestListPage');
  }

}

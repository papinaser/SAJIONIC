import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {ListPbDashboardsPage} from "../list-pb-dashboards/list-pb-dashboards";
import {TdmsExcelPage} from "../tdms-excel/tdms-excel";
import {JameReportsGroupsPage} from "../jame-reports-groups/jame-reports-groups";
import {Api, User} from "../../providers";
import {LoginPage} from "../login/login";
import {CarRequestListPage} from "../car-request-list/car-request-list";

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage implements OnInit{

  constructor(public navCtrl: NavController,
              public api:Api,
              public user:User,
              public toastCtrl:ToastController,
              public navParams: NavParams) {
  }
  username:string="abc";
  actions=["carRequest","tankhahFactor"];
  hasPermit=[false,false];

  ngOnInit(){
    this.user.getCurrentUser().then((userInfo) => {
      if (!userInfo || !userInfo.username) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }
      else{
        this.username = userInfo.username;
        let model = {
          actions:this.actions,
          token:this.username,
        };
        this.api.get("User/HasUserPermission",model).share()
          .subscribe((resp:any)=>{
            resp= JSON.parse(resp);
            if (resp.result=="200"){
              this.hasPermit= resp.message.hasPermit
            }
            else {
              this.showToast(resp.message);
            }
          });
      }
    });
  }

  showToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


  isUserHasPermission(action:string):boolean{
    let index =this.actions.findIndex(r=>r==action);
    return this.hasPermit[index];
  }

  ShowMenu(item:string){
    console.log(item);
    if (item=="pbiDashboard"){
      this.navCtrl.push(ListPbDashboardsPage);
    }
    else if (item=='tdmsLog'){
      this.navCtrl.push(TdmsExcelPage);
    }
    else if (item=="jameReports"){
      this.navCtrl.push(JameReportsGroupsPage);
    }
    else if(item=='carRequest'){
      this.navCtrl.push(CarRequestListPage);
    }
  }

}

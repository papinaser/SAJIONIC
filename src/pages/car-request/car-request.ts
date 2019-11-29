import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {keyValueModel} from "../../models/apiModels";
import {Api, User} from "../../providers";
import {LoginPage} from "../login/login";

/**
 * Generated class for the CarRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-car-request',
  templateUrl: 'car-request.html',
})
export class CarRequestPage implements OnInit{

  carRequest:any;
  carTypes:keyValueModel[];
  locations:keyValueModel[];
  title="";

  constructor(public navCtrl: NavController,
              public api:Api,
              public user:User,
              public toastCtrl:ToastController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarRequestPage');
  }
  ngOnInit(){
    this.title="ثبت درخواست خودرو";
    this.carRequest={};
    this.api.get("CarRequest/GetCarTypes").share()
      .subscribe((resp:any)=>{
        if (resp.result=="200"){
          this.carTypes=resp.message;
        }
        else{
          this.showToast(resp.message);
        }
      });

    this.api.get("CarRequest/GetLocations").share()
      .subscribe((resp:any)=>{
        if(resp.result=="200"){
          this.locations=resp.message;
        }
        else {
          this.showToast(resp.message);
        }
      })
  }
  showToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  onSubmit() {
    this.user.getCurrentUser().then(userInfo => {
      if (!userInfo || !userInfo.username) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }
      else {
        this.carRequest.token = userInfo.username;
        this.api.post("CarRequest", this.carRequest).share()
          .subscribe((resp: any) => {
            this.showToast(resp.message);
          });
      }
    });
  }

}

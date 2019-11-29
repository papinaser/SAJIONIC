import {Injectable} from "@angular/core";
import {AlertController, LoadingController, ToastController} from "ionic-angular";
import {keyValueModel} from "../models/apiModels";
import JDate from 'jalali-date';


@Injectable()
export class Utils {
  constructor(public toastCtrl:ToastController,
              public alertCtrl:AlertController,
              public loadingCtrl:LoadingController){

  }
  public getCurrentDateYear():number{
    const jdate = new JDate;
    return jdate.getFullYear();
  }
  public showToast(msg:string){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  showConfirm(title:string,msg:string):Promise<boolean> {
    return new Promise((resolve,reject)=>{
      const confirm = this.alertCtrl.create({
        title: title,
        message: msg,
        buttons: [
          {
            text: 'خیر',
            handler: () => {
              //confirm.dismiss(false);
              resolve(false);
            }
          },
          {
            text: 'بله',
            handler: () => {
              //confirm.dismiss(true);
              resolve(true);
            }
          }
        ]
      });

      confirm.present();
    });

  }
  showLoading(msg:string){
    let loading = this.loadingCtrl.create({
      spinner:'ios',
      content: msg
    });

    loading.present();

    return loading;
  }
  showPromt(title:string, msg:string){
    const promt = this.alertCtrl.create({
      cssClass:'promptLarge',
      title: title,
      message: msg,
      buttons:[{
        text:"تائید",
        role:'cancel'
      }]
    });
    promt.present();
  }
  public selectModal(title:string,list:keyValueModel[]):Promise<keyValueModel>{

    return new Promise<keyValueModel>((resolve,reject)=>{
      let alert = this.alertCtrl.create();
      alert.setCssClass('modalSelect');
      alert.setTitle(title);

      list.reduce(function(p, val) {
        return p.then(function() {
          alert.addInput({
            type: 'radio',
            label: val.label,
            value: val.value
          });
        });
      }, Promise.resolve()).then(function(finalResult) {
        // done here
        alert.addButton('لغو');
        alert.addButton({
          text: 'تائید',
          handler: data => {
            resolve(data);
          }
        });
        alert.present();
      }, function(err) {
        console.log(err);
        reject(err);
      });

    });

  }
}

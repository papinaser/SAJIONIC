import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular';
import {ExcelFormModel} from "../../models/powerBi";
import {Api, User} from "../../providers";
import {LoginPage} from "../login/login";


@Component({
  selector: 'page-excel-form',
  templateUrl: 'excel-form.html',
})
export class ExcelFormPage implements OnInit{

  title:string;
  model:ExcelFormModel;
  screenHeight:any;
  screenWidth:any;
  excelUrl="";
  lastError="";
  @ViewChild("excelLogform") form:ElementRef;
  @ViewChild("excelLogFrame") frame:ElementRef;

  constructor(public navCtrl: NavController,
              public viewCtrl:ViewController,
              public alertCtrl:AlertController,
              public api:Api,
              public user:User,
              public toastCtrl:ToastController,
              public loadingCtrl:LoadingController,
              public navParams: NavParams) {
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.getScreenSize();
    this.model= this.navParams.get("model");
    this.excelUrl="http://192.168.1.108/x/_layouts/xlviewerinternal.aspx?edit=1&WOPISrc=http%3a%2f%2f192.168.1.108%3a8091%2fwopi%2ffiles%2f"+this.model.fileName;
    this.title=this.model.isEditMode?"ویرایش لاگ":"ثبت لاگ";
    this.title+=" "+this.model.formName;
  }
  onBack(){
    this.viewCtrl.dismiss();
  }
  ionViewDidEnter(){
    this.form.nativeElement.submit();
    //(document.querySelector('#excelLogFrame') as HTMLElement).style.height = 'px';
    this.frame.nativeElement.style.width="100%";
    this.frame.nativeElement.style.height=this.screenHeight+"px";
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
  showLastError(){
    if (this.lastError){
      this.showPromt("خطای ذخیره",this.lastError);
    }
  }
  onSubmit(){
    this.showConfirm('ذخیره','آیا برای ذخیره لاگ مطمئنید؟').then(resp=>{
      if (resp){
        this.user.getCurrentUser().then((userInfo)=>{
          if (!userInfo || !userInfo.username) {
            this.navCtrl.setRoot(LoginPage);
            return;
          }
          let loading = this.showLoading('در حال ذخیره کردن لاگ...');
          let addr="";
          if (this.model.isEditMode){
            addr="TDMSLogs/SaveEditLog/"+this.model.masterLogId+"/"+this.model.modelRelationId+"/"+this.model.roykardId+"/"+this.model.fileName+"/"+userInfo.username;
          }
          else{
            addr="TDMSLogs/SaveNewLog/"+this.model.modelRelationId+"/"+this.model.roykardId+"/"+this.model.fileName+"/"+userInfo.username;
          }
          this.api.post(addr,{}).share()
            .subscribe((resp:any)=>{
              loading.dismiss();
              console.log(resp);
              if (resp.result=="200"){
                this.showToast(resp.message);
                this.lastError="";
                this.viewCtrl.dismiss(true);
              }
              else{
                this.lastError=resp.message;
                this.showToast(resp.message);
              }
            });
        });

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

}

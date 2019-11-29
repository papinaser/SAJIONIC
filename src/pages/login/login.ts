import {Component} from "@angular/core";
import {NavController,LoadingController, AlertController, ToastController, MenuController} from "ionic-angular";
import {RegisterPage} from "../register/register";
import {User} from "../../providers";
import {DashboardPage} from "../dashboard/dashboard";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  userInfo: { username: string, password: string } = {
    username: '',
    password: ''
  };

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';


  constructor(public nav: NavController,
              public forgotCtrl: AlertController,
              public user:User,
              public loadingCtrl: LoadingController,
              public menu: MenuController,
              public toastCtrl: ToastController) {
    this.menu.swipeEnable(false);
  }

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
  login() {
    let loading = this.loadingCtrl.create({
      spinner:'ios',
      content: 'در حال احراز هویت...'
    });

    loading.present();

    this.user.login(this.userInfo).subscribe((resp:any) => {
      //resp= JSON.parse(resp);
      loading.dismiss();
      if (resp.result=="200"){
        this.nav.setRoot(DashboardPage);
      }
      else {
        this.showToast(resp.message);
      }

    }, (err) => {
      loading.dismiss();
      // Unable to log in
      if (err.message.indexOf('(unknown url)')){
        err.message="اتصال به سرور برقرار نمی باشد";
      }
      this.showToast(err.message);
    });
  }


  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  showToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'ایمیل شما',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            let toast = this.toastCtrl.create({
              message: 'Email was sended successfully',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }

}

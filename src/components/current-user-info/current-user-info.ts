import {Component, OnInit} from '@angular/core';
import {User} from "../../providers";
import {NavController} from "ionic-angular";
import {LoginPage} from "../../pages/login/login";


@Component({
  selector: 'current-user-info',
  templateUrl: 'current-user-info.html'
})
export class CurrentUserInfoComponent  implements OnInit{
  currentUser:string="";
  constructor(public user:User,
  public navCtrl:NavController) {

  }

  ngOnInit(){
    this.user.getCurrentUser().then((userInfo)=>{
      if (userInfo !=null){
        this.currentUser=userInfo.title
      }
    })
  }

  showUserMenu(){
    this.user.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ModalController,
  NavController,
  Platform,
} from 'ionic-angular';
import {Api, User} from "../../providers";
import {LoginPage} from "../login/login";
import {LogDetailsModel, ManageLogsModel} from "../../models/powerBi";
import {Utils} from "../../services/utils";
import {keyValueModel} from "../../models/apiModels";
import {SelectLogDetailFormPage} from "../select-log-detail-form/select-log-detail-form";
import {LogDetailsPage} from "../log-details/log-details";
import {ManageLogsPage} from "../manage-logs/manage-logs";
import {UploadExcelLogPage} from "../upload-excel-log/upload-excel-log";
@Component({
  selector: 'page-tdms-excel',
  templateUrl: 'tdms-excel.html',
})
export class TdmsExcelPage implements OnInit,OnDestroy {

  username = "";
  selectedMLId: number;
  selectedSetTypeItemId: number;
  selectedRoykard: keyValueModel;
  selectedMojodiat: keyValueModel;


  constructor(public api: Api,
              public user: User,
              public modalCtrl: ModalController,
              public navCtrl: NavController,
              public util: Utils,
              public platform: Platform) {

  }

  ngOnInit(): void {
    this.user.getCurrentUser().then((userInfo) => {
      if (!userInfo || !userInfo.username) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }
      this.username = userInfo.username;
    });
  }
  ngOnDestroy(): void {
    this.username=null;
    this.selectedRoykard=null;
    this.selectedMojodiat=null;
    this.selectedSetTypeItemId=null;
    this.selectedMLId=null;
  }


  mojodiatSelected(selNode) {
    this.selectedMojodiat = selNode;
  }

  showLogForm() {
    this.selectLogForm(false).then((resp) => {
      if (resp) {
        const model = new ManageLogsModel(this.selectedMojodiat, this.selectedRoykard);
        this.navCtrl.push(ManageLogsPage, {model: model});
      }
    });
  }

  selectLogForm(forReport: boolean): Promise<boolean> {
    return new Promise<boolean>((resove, reject) => {
      if (!this.selectedMojodiat) {
        this.util.showToast('لطفا موجودیت مورد نظر را انتخاب کنید');
        resove(false);
      } else {
        let modal = this.modalCtrl.create(SelectLogDetailFormPage,
          {selectedMRId: this.selectedMojodiat.key, forReport: forReport});

        modal.onDidDismiss(resp => {
          if (!resp || !resp.selectedRoykard) {
            resove(false);
          } else {
            this.selectedRoykard = resp.selectedRoykard;
            if (forReport) {
              this.selectedSetTypeItemId = resp.selectedSetTypeItemId;
            } else {
              this.selectedSetTypeItemId = null;
            }
            resove(true);
          }
        });

        modal.present();

      }
    });

  }
  uploadLogs(){
    if (!this.selectedMojodiat) {
      this.util.showToast('لطفا موجودیت مورد نظر را انتخاب کنید');
    }
    else {
      const modal = this.modalCtrl.create(UploadExcelLogPage,
        {modelRelation: this.selectedMojodiat, username:this.username});
      modal.present();
    }

  }
  showReports() {
    this.selectLogForm(true).then((resp) => {
      if (resp) {
        const model = new LogDetailsModel(this.selectedMojodiat, this.selectedRoykard, this.selectedSetTypeItemId);
        this.navCtrl.push(LogDetailsPage, {model: model});
      }
    });
  }
}

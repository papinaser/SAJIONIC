import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {keyValueModel} from "../../models/apiModels";
import {Utils} from "../../services/utils";
import {Api, User} from "../../providers";

@Component({
  selector: 'page-upload-excel-log',
  templateUrl: 'upload-excel-log.html',
})
export class UploadExcelLogPage implements OnInit,OnDestroy {

  modelRelation: keyValueModel;
  excelFile:any;
  xml1File: any;
  xml2File: any;
  username="";
  lastErr="";

  constructor(public viewCtrl: ViewController,
              public util:Utils,
              public user:User,
              public api:Api,
              public navParams: NavParams) {
  }

  ngOnInit(): void {
    this.modelRelation = this.navParams.get("modelRelation");
    this.username= this.navParams.get("username");
  }
  ngOnDestroy(): void {
    this.modelRelation=null;
    this.excelFile=null;
    this.xml1File=null;
    this.xml2File=null;
    this.username=null;
    this.lastErr=null;
  }

  onExcelFileSelected($event) {
    this.excelFile="";
    const files =$event.target.files;
    if (files && files.length == 1) {
      const exFl = $event.target.files[0];
      if (exFl.size>1024*1024){
        this.util.showToast("حجم فایل اکسل نباید بیشتر از 1 مگ باشد");
        $event.target.value="";
        return;
      }
      if (!exFl.name.endsWith(".xlsm") && !exFl.name.endsWith(".xlsx") && !exFl.name.endsWith(".xls")){
        this.util.showToast("فایل اکسل نامعتبر می باشد");
        $event.target.value="";
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(exFl);
      reader.onload = () => {
        this.excelFile = reader.result;
      }
    }
  }
  onXml1FileSelected($event){
    this.xml1File=null;
    const files =$event.target.files;
    if (files && files.length == 1) {
      const xmlFl = $event.target.files[0];
      if (xmlFl.size>100*1024){
        this.util.showToast("حجم فایل اکس اک ال نباید بیشتر از 100 گیلو باشد");
        $event.target.value="";
        return;
      }
      if (!xmlFl.name.endsWith(".xml")){
        this.util.showToast("فایل اکس ام ال 1  نامعتبر می باشد");
        $event.target.value="";
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(xmlFl);
      reader.onload = () => {
        this.xml1File = reader.result;
      }
    }
  }
  onXml2FileSelected($event){
    this.xml2File=null;
    if (this.xml1File==null){
      this.util.showToast("ابندا فایل اکس ام ال 1 را انتخاب کنید");
      $event.target.value="";
      return;
    }
    const files =$event.target.files;
    if (files && files.length == 1) {
      const xmlFl = $event.target.files[0];
      if (xmlFl.size>100*1024){
        this.util.showToast("حجم فایل اکس اک ال نباید بیشتر از 100 گیلو باشد");
        $event.target.value="";
        return;
      }
      if (!xmlFl.name.endsWith(".xml")){
        this.util.showToast("فایل اکس ام ال 1  نامعتبر می باشد");
        $event.target.value="";
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(xmlFl);
      reader.onload = () => {
        this.xml2File = reader.result;
      }
    }
  }
  onSubmit() {
    if (this.isFormValid()) {
      const uploadMOdel = {
        excelFile: this.excelFile,
        xml1File: this.xml1File,
        xml2File: this.xml2File,
        modelRelationId: this.modelRelation.value,
        token:this.username,
      };
      let loading = this.util.showLoading("در حال بارگذاری...");
      this.api.post("TDMSLogs/UploadExcelLog",uploadMOdel).share()
        .subscribe((resp:any)=>{
          if (resp.result=="200"){
            this.util.showToast(resp.message);
            this.viewCtrl.dismiss(true);
          }
          else{
            this.lastErr=resp.message;
            this.util.showToast(resp.message);
          }
          loading.dismiss();
        },(err)=>{
          loading.dismiss();
          this.lastErr=err.message;
          this.util.showToast(err.message);
        });
    }
  }
  showLastError(){
    this.util.showPromt("خطا!!!",this.lastErr);
  }
  onCancel(){
    this.viewCtrl.dismiss(false);
  }
  isFormValid(){
    return this.excelFile!=null;
  }

}

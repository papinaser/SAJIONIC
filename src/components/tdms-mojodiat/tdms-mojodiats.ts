import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoadingController, NavController, ToastController} from "ionic-angular";
import {treeModel} from "../../models/powerBi";
import {Api, User} from "../../providers";
import {IActionMapping, KEYS, TREE_ACTIONS, TreeNode} from "angular-tree-component";
import {LoginPage} from "../../pages/login/login";
import {keyValueModel} from "../../models/apiModels";



@Component({
  selector: 'tdms-mojodiat',
  templateUrl: 'tdms-mojodiat.html'
})
export class TdmsMojodiatsComponent implements OnInit {

  @Input() showCheckBox? = false;
  @Input() nodesSource:treeModel[]=null;
  @Output() nodeSelected: EventEmitter<keyValueModel> = new EventEmitter<keyValueModel>();

  iconPaths="../../assets/img/mojodiat/";
  treeNodes: treeModel[] = [];
  options = {};
  username: string;

  constructor(
    public api: Api,
    public user: User,
    public loadingCtrl:LoadingController,
    public nacCtrl: NavController,
    public toastCtrl: ToastController,
  ) {

  }
  getNodeImage(node){
    const title= node.data.title;
    if (title.startsWith("شرکت اصل")){
      return this.iconPaths+"MainCompany.svg"
    }
    if (title.startsWith("شرکت")) {
      return this.iconPaths+"Company.svg";
    }
    if (title.startsWith("اداره") || title.startsWith("مدیریت") || title.startsWith("منطقه")){
      return this.iconPaths+"Edare.svg";
    }
    if (title.startsWith("بهره")){
      return this.iconPaths+"Bahre.svg";
    }
    if (title.startsWith("واحد")){
      return this.iconPaths+"Vahed.svg";
    }
    if (title.startsWith("چاه")){
      return this.iconPaths+"Chah.svg";
    }
    if (title.startsWith("پايانه")){
      return this.iconPaths+"Payaneh.svg";
    }
    if (title.startsWith("تاسیسات") || title.startsWith("پتروفيزيک") || title.startsWith("پشتیبانی و آموزش") || title.startsWith("پژوهش و توسعه")){
      return this.iconPaths+"Tasis.svg";
    }
    if (title.startsWith("ميدان") || title.startsWith("میدان")){
      return this.iconPaths+"Midan.svg";
    }
    if (title.startsWith("پالا")|| title.startsWith("مرکز")){
      return this.iconPaths+"Palash.svg";
    }

  }
  ngOnInit() {
    const loading = this.loadingCtrl.create({
      spinner:'ios',
      content: 'در حال لود اطلاعات...'
    });
    loading.present();
    this.user.getCurrentUser().then((userInfo) => {
      if (!userInfo || !userInfo.username) {
        this.nacCtrl.setRoot(LoginPage);
        return;
      }
      this.username = userInfo.username;
      if (this.nodesSource==null) {
        let seq = this.api.get("TDMSLogs/GetMojodiatsTreeNodes/root/" + this.username).share();
        seq.subscribe((resp: any) => {
          resp = JSON.parse(resp);
          if (resp.result === "200") {
            this.treeNodes = resp.message;
            loading.dismiss();
            this.configTree();
          } else {
            this.showToast(resp.message);
          }
        });
      }
      else{
        this.treeNodes=this.nodesSource;
        loading.dismiss();
        this.configTree();
      }
    });
  }

  configTree(){
    const actionMapping: IActionMapping = {
      mouse: {
        click: (tree, node, $event) => {
          if (!node.isActive) {
            TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
            this.nodeSelected.emit({key:node.id,value: node.data.title});
          }
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          if (!node.isActive) {
            TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
            this.nodeSelected.emit({key:node.id,value: node.data.title});
          }
        }
      }
    };

    this.options = {
      actionMapping: actionMapping,
      rtl: true,
      idField: 'id',
      displayField: 'title',
      useCheckbox: this.showCheckBox,
      childrenField: 'childs',
      getChildren: (node:TreeNode) => {
        return this.loadChildNodes(node);
      }
    }
  }

  loadChildNodes(node:TreeNode) {
    return new Promise<TreeNode[]>((resolve ,reject)=>{
      let seq = this.api.get("TDMSLogs/GetMojodiatsTreeNodes/" + node.id + "/" + this.username).share();
      seq.subscribe((resp: any) => {
        resp = JSON.parse(resp);
        if (resp.result === "200") {
          resolve(resp.message);
        }
        else {
          reject(resp.message);
          this.showToast(resp.message);
        }
      });
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

}

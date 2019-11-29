import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginPage} from "../../pages/login/login";
import {IActionMapping, KEYS, TREE_ACTIONS} from "angular-tree-component";
import {Utils} from "../../services/utils";
import {Api, User} from "../../providers";
import {NavController} from "ionic-angular";
import {treeModel} from "../../models/powerBi";
@Component({
  selector: 'jame-reports',
  templateUrl: 'jame-reports.html'
})
export class JameReportsComponent implements OnInit{

  username:string;
  treeNodes: treeModel[] = [];
  options = {};

  @Output() nodeSelected: EventEmitter<any> = new EventEmitter<any>();
  constructor(private util:Utils,private user:User,
              private api:Api,
              private  navCtrl:NavController) {
  }

  ngOnInit() {
    const loading = this.util.showLoading('در حال لود اطلاعات...');
    this.user.getCurrentUser().then((userInfo) => {
      if (!userInfo || !userInfo.username) {
        this.navCtrl.setRoot(LoginPage);
        return;
      }
      this.username = userInfo.username;

      let seq = this.api.get("JameReport/GetReportTree/" + this.username).share();
      seq.subscribe((resp: any) => {
        if (resp.result === "200") {
          this.treeNodes = resp.message;
          loading.dismiss();
          const actionMapping: IActionMapping = {
            mouse: {
              click: (tree, node, $event) => {
                if (!node.isActive) {
                  TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
                  this.nodeSelected.emit({key:node.id,value: node.data.title,treeNode:node});
                }
              }
            },
            keys: {
              [KEYS.ENTER]: (tree, node, $event) => {
                if (!node.isActive) {
                  TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
                  this.nodeSelected.emit({key:node.id,value: node.data.title,treeNode:node});
                }
              }
            }
          };

          this.options = {
            actionMapping: actionMapping,
            rtl: true,
            idField: 'id',
            displayField: 'title',
            childrenField: 'childs'
          }

        }
        else {
          this.util.showToast(resp.message);
        }
      });
    });
  }

  getNodeImage(node){
    if (!node.hasChildren){
      return "../../assets/img/reportIcon.svg"
    }
    if (node.isExpanded){
      return "../../assets/img/folderOpen.svg";
    }
    return "../../assets/img/folder.svg";
  }
}

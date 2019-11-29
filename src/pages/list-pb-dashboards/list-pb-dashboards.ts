import {Component, OnInit} from '@angular/core';
import {NavController, Platform, ToastController} from 'ionic-angular';
import {TREE_ACTIONS, KEYS, IActionMapping } from 'angular-tree-component';

import {Api} from "../../providers";
import {treeModel} from "../../models/powerBi";
import {DomSanitizer} from "@angular/platform-browser";
import {dateRange} from "../../models/dateRange";

/**
 * Generated class for the ListPbDashboardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-list-pb-dashboards',
  templateUrl: 'list-pb-dashboards.html',
})
export class ListPbDashboardsPage implements OnInit{


  treeNodes:treeModel[]=[];
  dateFilter:dateRange;
  hidePanel=false;
  biUrl;
  options = {};
  mobileModeWidth=960;
  constructor(public navCtrl: NavController,
              public api:Api,
              public platform: Platform,
              public sanitizer: DomSanitizer,
              public toastCtrl:ToastController) {
  }

  ngOnInit() {
    const deviceWidth= this.platform.width();
    window.onresize=($event)=>{
      const cw= this.platform.width();
        this.hidePanel=cw<=this.mobileModeWidth;
    };
    if (deviceWidth<=this.mobileModeWidth){
      this.hidePanel=true;
    }
    let seq1 = this.api.get("BiDashboard/GetDashboards").share();
    seq1.subscribe((resp: any) => {
      resp= JSON.parse(resp);
      if (resp.result === "200") {
        this.treeNodes= resp.message;
        this.showFirstDashboard(this.treeNodes);
        const actionMapping:IActionMapping = {
          mouse: {
            click: (tree, node, $event)=>{
              if (!node.isActive) {
                TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
                this.showBiDashboard(node);
              }
            }
          },
          keys: {
            [KEYS.ENTER]: (tree, node, $event)=>{
              if (!node.isActive) {
                TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
                this.showBiDashboard(node);
              }
            }
          }
        };

        this.options={
          actionMapping:actionMapping,
          rtl: true,
          idField: 'id',
          displayField: 'title',
          childrenField: 'childs'
        }

      }
      else{
        this.showToast(resp.message);
      }
    });

    let seq2= this.api.get("BiDashboard/GetSelectDateRange/1").share();
    seq2.subscribe((resp:any)=>{
      resp= JSON.parse(resp);
      if (resp.result === "200") {
        console.log(resp);
        this.dateFilter= new dateRange(resp.message.startDate,resp.message.endDate);
      }
      else{
        this.showToast(resp.message);
      }
    });
  }
  onMinimizeConfigPanel(){
    this.hidePanel=true;
  }
  onDateChange(){
    this.dateFilter.calculateStartEndDate("dddd DD MMMM YYYY");
  }
  showFirstDashboard(nodes:treeModel[]){
    nodes.forEach((node)=>{
      if (!node.hasChildren){
        this.showBiDashboard(node);
      }
      else{
        this.showFirstDashboard(node.childs);
      }
    });
  }
  showBiDashboard(node){
    this.biUrl= this.sanitizer.bypassSecurityTrustResourceUrl("http://desktop-ltuj9v5:8088/powerbi/?id="+node.id);
    let bivElm = (document.querySelector('.biViewerContent') as HTMLElement);
    bivElm.style.height = document.body.scrollHeight + 'px';
    bivElm.scrollTo(0,0);
  }
  getNodeIcon(node):string{
    if (!node.hasChildren){
      return "podium"
    }
    else if (node.isExpanded){
      return "folder-open";
    }
    else{
      return "folder";
    }
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

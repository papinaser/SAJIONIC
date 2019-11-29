import {keyValueModel} from "./apiModels";

export class poweBiCatalog {
  constructor(public itemID:string,
  public name:string,
  public parentID:string,
  public description:string,
  public type:number) {

  }
}
export class treeModel {
  constructor(public id:string,public title:string,public hasChildren:boolean,public childs?:any[]){

  }
}

export class ExcelFormModel {
  constructor(public fileName:string,public formName:string,public isEditMode:boolean
              ,public modelRelationId:string,public roykardId:number,public masterLogId:number=null){

  }
}

export class LogFormModel {
  constructor(public formName:string,public isEditMode:boolean,
              public modelRelationId:string,public roykardId:number,public masterLogId:number=0){

  }
}

export class LogDetailsModel {
  constructor(public modelReation:keyValueModel,
              public roykard:keyValueModel,
              public setTypeItemId:number){

  }
}
export class GetDetailLogReportModel{
  constructor(public modelRelationId:string,public roykardId:string,
              public setTypeItemId:number,public reportId:string,
              public tblIds:string,public token:string){
  }
}

export class ManageLogsModel {
  constructor(public modelRelation:keyValueModel,public roykard:keyValueModel){

  }

}

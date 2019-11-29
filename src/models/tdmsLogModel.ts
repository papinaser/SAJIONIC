import {LogFormModel} from "./powerBi";

export class logParam{
  public id:number;
  public name:string;
  public title:string;
  public type:string;
  public unit:string;
  public isDetail:boolean;
  public isRequired:boolean;
  public minVal:number;
  public maxVal:number;
  public isReadonly:boolean;
}
export class logGroupParam {
  public groupName:string;
  public groupIndex:number;
  public masterFields:logParam[];
  public detailFields:logParam[];
}
export class logMRModel {
  public id:number;
  public title:string;
  public isChild:boolean;
  public groupParams:logGroupParam[];
}
export class tdmsLogModel {
  public mainMasterParams:logParam[];
  public mrParams :logMRModel[];
  public dataSource:any;
}

export class detailLogModel{
  public detailFields:logParam[];
  public groupName:string;
  public groupIndex:number;
  public isEditMode:boolean;
  public dataSource:any;
  public logFormModel:LogFormModel;
  public token:string;
  public title:string;
}

export class saveDataEntryModel {
  public dataSource:any;
  public initData:any;
  public masterLogId:number;
  public modelRelationId:string;
  public roykardId:number;
  public logType:number;
  public token:string;
}

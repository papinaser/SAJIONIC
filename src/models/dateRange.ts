import JDate from 'jalali-date';

export class dateRange {
  public startDate:string;
  public endDate:string;
  public stdStartDate:string;
  public stdEndDate:string;
  public daysDiff:number;
  public sdVal:number;
  public edVal:number;
  public minDate:Date;
  public maxDate:Date;

  constructor(sd:string,ed:string){
    let temp= sd.split("/");
    this.minDate= JDate.toGregorian(Number(temp[0]),Number(temp[1]),Number(temp[2]));
    temp= ed.split("/");
    this.maxDate= JDate.toGregorian(Number(temp[0]),Number(temp[1]),Number(temp[2]));

    this.daysDiff= this.getDiffDays(this.minDate,this.maxDate);

    this.sdVal=0;
    this.edVal= this.daysDiff;

    if (this.daysDiff>=1){
      this.sdVal=this.edVal-1;
    }
    this.calculateStartEndDate('dddd DD MMMM YYYY');
  }

  calculateStartEndDate(format:string){
    let jsd:JDate= new JDate(this.addDays(this.minDate,this.sdVal));
    let jed:JDate= new JDate(this.addDays(this.minDate,this.edVal));

    this.startDate= jsd.format(format);
    this.endDate= jed.format(format);

    this.stdStartDate=jsd.format('YYYY/MM/DD');
    this.stdEndDate=jed.format('YYYY/MM/DD');
  }

  getDiffDays(firstDate:Date,secondDate:Date){
    const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
  }
  addDays(date:Date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

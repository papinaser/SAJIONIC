import {NgModule,Injector} from "@angular/core";
import {IonicApp, IonicModule} from "ionic-angular";
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { IonicSelectableModule } from 'ionic-selectable';
import { AgGridModule } from 'ag-grid-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Keyboard} from '@ionic-native/keyboard';
import { TreeModule } from 'angular-tree-component';
import { IonicStorageModule } from '@ionic/storage';
import { IonicStepperModule } from 'ionic-stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {ActivityService} from "../services/activity-service";
import {TripService} from "../services/trip-service";
import {WeatherProvider} from "../services/weather";
import {MyApp} from "./app.component";
import {SettingsPage} from "../pages/settings/settings";
import {CheckoutTripPage} from "../pages/checkout-trip/checkout-trip";
import {HomePage} from "../pages/home/home";
import {LoginPage} from "../pages/login/login";
import {NotificationsPage} from "../pages/notifications/notifications";
import {RegisterPage} from "../pages/register/register";
import {SearchLocationPage} from "../pages/search-location/search-location";
import {TripDetailPage} from "../pages/trip-detail/trip-detail";
import {TripsPage} from "../pages/trips/trips";
import {LocalWeatherPage} from "../pages/local-weather/local-weather";
import {Api, User} from "../providers";
import {AppState} from "./app.global";
import {Items} from "../providers/items/items";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {ListPbDashboardsPage} from "../pages/list-pb-dashboards/list-pb-dashboards";
import {ComponentsModule} from "../components/components.module";
import {TdmsExcelPage} from "../pages/tdms-excel/tdms-excel";
import {JameReportsGroupsPage} from "../pages/jame-reports-groups/jame-reports-groups";
import {CarRequestPage} from "../pages/car-request/car-request";
import {CarRequestListPage} from "../pages/car-request-list/car-request-list";
import {ExcelFormPage} from "../pages/excel-form/excel-form";
import {Utils} from "../services/utils";
import {SelectLogDetailFormPage} from "../pages/select-log-detail-form/select-log-detail-form";
import {DpDatePickerModule} from 'ng2-jalali-date-picker';
import {LogDetailsPage} from "../pages/log-details/log-details";
import {ShowPdfReportPage} from "../pages/show-pdf-report/show-pdf-report";
import {ManageLogsPage} from "../pages/manage-logs/manage-logs";
import {UploadExcelLogPage} from "../pages/upload-excel-log/upload-excel-log";
import {TdmsLogPage} from "../pages/tdms-log/tdms-log";
import {TdmsDetailLogPage} from "../pages/tdms-detail-log/tdms-detail-log";

// import services
// end import services
// end import services

// import pages
// end import pages

@NgModule({
  declarations: [
    MyApp,
    ListPbDashboardsPage,
    SettingsPage,
    CheckoutTripPage,
    HomePage,
    ExcelFormPage,
    CarRequestListPage,
    CarRequestPage,
    LoginPage,
    TdmsExcelPage,
    LogDetailsPage,
    ShowPdfReportPage,
    ManageLogsPage,
    UploadExcelLogPage,
    DashboardPage,
    SelectLogDetailFormPage,
    JameReportsGroupsPage,
    TdmsLogPage,
    TdmsDetailLogPage,
    LocalWeatherPage,
    NotificationsPage,
    RegisterPage,
    SearchLocationPage,
    TripDetailPage,
    TripsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    IonicSelectableModule,
    BrowserAnimationsModule,
    IonicStepperModule,
    DpDatePickerModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    TreeModule,
    ComponentsModule,
    IonicStorageModule.forRoot({
      name: 'SAJ',
        driverOrder: ['sqlite','websql','indexeddb']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPbDashboardsPage,
    SettingsPage,
    CheckoutTripPage,
    HomePage,
    ExcelFormPage,
    CarRequestListPage,
    CarRequestPage,
    LoginPage,
    TdmsExcelPage,
    LogDetailsPage,
    ShowPdfReportPage,
    ManageLogsPage,
    UploadExcelLogPage,
    DashboardPage,
    SelectLogDetailFormPage,
    JameReportsGroupsPage,
    TdmsLogPage,
    TdmsDetailLogPage,
    LocalWeatherPage,
    NotificationsPage,
    RegisterPage,
    SearchLocationPage,
    TripDetailPage,
    TripsPage
  ],
  providers: [
    Utils,
    Api,
    AppState,
    Items,
    User,
    StatusBar,
    SplashScreen,
    Keyboard,
    ActivityService,
    TripService,
    WeatherProvider
  ]
})

export class AppModule {
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}

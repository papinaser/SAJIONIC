import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {enableProdMode} from '@angular/core';
import {AppModule} from "./app.module";
import {LicenseManager} from "ag-grid-enterprise";

LicenseManager.setLicenseKey("IRDEVELOPERS_COM_NDEwMjM0NTgwMDAwMA==f08aae16269f416fe8d65bbf9396be5f");


// this is the magic wand
enableProdMode();

platformBrowserDynamic().bootstrapModule(AppModule);

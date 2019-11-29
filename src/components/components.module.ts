import { NgModule } from '@angular/core';
import { SajPanelComponent } from './saj-panel/saj-panel';
import {CommonModule} from "@angular/common";
import { ExpandableComponent } from './expandable/expandable';
import { SajAccordionComponent } from './saj-accordion/saj-accordion';
import {IonicModule} from "ionic-angular";
import {SideMenuContentComponent} from "./side-menu-content/side-menu-content.component";
import { TdmsMojodiatsComponent } from './tdms-mojodiat/tdms-mojodiats';
import {TreeModule} from "angular-tree-component";
import { StickyPanelComponent } from './sticky-panel/sticky-panel';
import { CurrentUserInfoComponent } from './current-user-info/current-user-info';
import { PageHeaderComponent } from './page-header/page-header';
import { DiagramEditorComponent } from './diagram-editor/diagram-editor';
import { JameReportsComponent } from './jame-reports/jame-reports';
import { SajTapComponent } from './saj-tap/saj-tap';
import {SajTabsComponent} from "./saj-tap/saj-tabs";
import { SajCollapsibleComponent } from './saj-collapsible/saj-collapsible';
import { SajInputComponent } from './saj-input/saj-input';
import {DpDatePickerModule} from "ng2-jalali-date-picker";
import {IonicSelectableModule} from "ionic-selectable";

@NgModule({
	declarations: [SajPanelComponent,
    ExpandableComponent,
    SideMenuContentComponent,
    SajAccordionComponent,
    TdmsMojodiatsComponent,
    StickyPanelComponent,
    CurrentUserInfoComponent,
    PageHeaderComponent,
    DiagramEditorComponent,
    JameReportsComponent,
    SajTabsComponent,
    SajTapComponent,
    SajCollapsibleComponent,
    SajInputComponent],
  imports: [CommonModule, TreeModule, IonicModule.forRoot(ComponentsModule), DpDatePickerModule, IonicSelectableModule],
	exports: [SajPanelComponent,
    ExpandableComponent,
    SideMenuContentComponent,
    SajAccordionComponent,
    TdmsMojodiatsComponent,
    StickyPanelComponent,
    CurrentUserInfoComponent,
    PageHeaderComponent,
    DiagramEditorComponent,
    JameReportsComponent,
    SajTabsComponent,
    SajTapComponent,
    SajCollapsibleComponent,
    SajInputComponent]
})
export class ComponentsModule {}

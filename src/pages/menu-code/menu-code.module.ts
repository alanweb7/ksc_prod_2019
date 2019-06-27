import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuCodePage } from './menu-code';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient} from "@angular/common/http";
@NgModule({
  declarations: [
    MenuCodePage,
  ],
  imports: [
    IonicPageModule.forChild(MenuCodePage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ]
  
})
export class MenuCodePageModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
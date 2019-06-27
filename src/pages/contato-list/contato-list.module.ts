import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContatoListPage } from './contato-list';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient} from "@angular/common/http";
@NgModule({
  declarations: [
    ContatoListPage,
  ],
  imports: [
    IonicPageModule.forChild(ContatoListPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class ContatoListPageModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
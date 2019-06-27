import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CodeSenhaPage } from './code-senha';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient} from "@angular/common/http";
@NgModule({
  declarations: [
    CodeSenhaPage,
  ],
  imports: [
    IonicPageModule.forChild(CodeSenhaPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class CodeSenhaPageModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClienteProvider } from '../../providers/cliente/cliente';
import { BonusPage } from './bonus';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrMaskerModule } from 'brmasker-ionic-3';
import {HttpClient} from "@angular/common/http";
@NgModule({
  declarations: [
    BonusPage,
  ],
  imports: [
    IonicPageModule.forChild(BonusPage),
    BrMaskerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  
  providers:[
    ClienteProvider
  ]
})
export class BonusPageModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageCodePage } from './image-code';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient} from "@angular/common/http";
@NgModule({
  declarations: [
    ImageCodePage,
  ],
  imports: [
    IonicPageModule.forChild(ImageCodePage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
   PhotoViewer
  ]
})
export class ImageCodePageModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
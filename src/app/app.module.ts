import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule, } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
//import native
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { Deeplinks } from '@ionic-native/deeplinks';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Base64 } from '@ionic-native/base64';
import {  File } from '@ionic-native/file';
import { NativeStorage } from '@ionic-native/native-storage';
import { AngularFireModule } from "angularfire2";
import { FIREBASE_CONFIG } from './firebase.config';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { Diagnostic } from '@ionic-native/diagnostic';
import { HistoricoService } from '../providers/historico/historico.service';
//import provider
import { SqliteHelperService } from '../providers/sqlite-helper/sqlite-helper.service';
import { CodeProvider } from '../providers/code/code';
import { NetworkProvider } from '../providers/network/network';
import { UsuarioService } from '../providers/movie/usuario.service';
import { UtilService } from '../providers/util/util.service';
import { Autosize} from '../directives/autosize/autosize';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';
import { GeolocationProvider } from '../providers/geolocation/geolocation';
import { PopoverComponent } from '../components/popover/popover';
import { PopoverFavComponent } from '../components/popover-fav/popover-fav';


@NgModule({
  declarations: [
    MyApp,
    Autosize,
    ProgressBarComponent,
    PopoverComponent,
    PopoverFavComponent
   
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
      TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: (HttpLoaderFactory),
              deps: [HttpClient]
          }
      }),  
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    IonicStorageModule.forRoot()    ,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PopoverComponent
    ,
    PopoverFavComponent
  
  ],
  providers: [
    SQLite,
    NativeStorage,
    SqliteHelperService,
    CodeProvider,
    Geolocation,
    Deeplinks,
    Base64,
    SocialSharing,
    BrowserTab,
    File,
    Network,
    NetworkProvider,
    StatusBar,
    SplashScreen,
    UsuarioService,
    UtilService,
    Diagnostic,
    HistoricoService,
    GeolocationProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  
    
  ]
  ,

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CupomPage } from './cupom';

@NgModule({
  declarations: [
    CupomPage,
  ],
  imports: [
    IonicPageModule.forChild(CupomPage),
  ],
  providers: [
    SocialSharing
  ]
})
export class CupomPageModule {}

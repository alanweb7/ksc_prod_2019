import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideCodeFirebasePage } from './vide-code-firebase';
import { VideoEditor } from '@ionic-native/video-editor';

@NgModule({
  declarations: [
    VideCodeFirebasePage,
  ],
  imports: [
    IonicPageModule.forChild(VideCodeFirebasePage),
  ],
  providers: [
    
    VideoEditor,
   
  ]
})
export class VideCodeFirebasePageModule {}

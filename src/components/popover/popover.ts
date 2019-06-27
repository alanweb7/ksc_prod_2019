import { Component, Input } from '@angular/core';
import { NavParams, NavController, ToastController, AlertController, Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { UtilService } from '../../providers/util/util.service';
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from '../../providers/code/code';

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  @Input('token') token;
  @Input('code_id') code_id;
  text: string;
  visite_code: string;
  card: string | string[];
  codeNumber: any;
  lang: any;
  slug: string;
  msg_servidor: any;
  excluir_msg: any;
  package_imagens: any;
  codes_videos: any;
  package_name: any;
  package_videos: any;
  load_aguarde: any;
  msg_exlcuir: any;
  btn_cancelar: any;
  btn_excluir: any;

  constructor( private events         : Events, public alertCtrl     : AlertController, private codeProvider  : CodeProvider,  public toast         : ToastController, public  net          : NetworkProvider,public util          : UtilService, public navCtrl        : NavController,    public navParams     : NavParams,  private socialSharing : SocialSharing,
    ) {
    console.log('Hello PopoverComponent Component');
    this.text = 'Hello World';
    this.token        = this.navParams.get('token');
    this.code_id      = this.navParams.get('code_id');
    this.visite_code  = this.navParams.get('visite_code');
    this.card         = this.navParams.get('card');
    this.lang         = this.navParams.get('lang');
    this.slug         = this.navParams.get('slug');
    this.codeNumber         = this.navParams.get('codeNumber');
    this.msg_servidor         = this.navParams.get('msg_servidor');
    this.excluir_msg         = this.navParams.get('excluir_msg');
    this.load_aguarde         = this.navParams.get('load_aguarde');
    this.package_imagens         = this.navParams.get('package_imagens');
    this.package_videos         = this.navParams.get('package_videos');
    this.package_name         = this.navParams.get('package_name');
    this.msg_exlcuir         = this.navParams.get('msg_exlcuir');
    this.btn_cancelar         = this.navParams.get('btn_cancelar');
    this.btn_excluir         = this.navParams.get('btn_excluir');
    console.log(this.token);
    console.log(this.code_id);
  }
  // compartilhar social share
  shareSheetShare() {
    this.socialSharing.share(this.visite_code+"->", "Share subject", this.card, "https://kscode.com.br/card?code="+this.slug).then(() => {
      console.log("shareSheetShare: Success");
    }).catch(() => {
      console.error("shareSheetShare: failed");
    });
  
  }
  showPromptPush() {
    this.navCtrl.push('NotificacaoPushPage',{codeNumber:this.codeNumber,lang:this.lang,token:this.token});
   
  }
  ShowMenu(code){
    console.log(this.token);
    this.navCtrl.push('MenuCodePage', {token:this.token,code:this.code_id,package_imagens:this.package_imagens,package_videos:this.package_videos,package_name:this.package_name,lang:this.lang});
}
 //chamada alerta de confirmação antes de excluir
 showConfirm() {
  const confirm = this.alertCtrl.create({
   title: this.msg_exlcuir,
   message: '',
   buttons: [
     {
       text: this.btn_cancelar,
       handler: () => {
         console.log('Disagree clicked');
       }
     },
     {
       text: this.btn_excluir,
       handler: () => {
         this.code_remove();
       }
     }
   ]
 });
 confirm.present();


} 
  code_remove(){
    if(this.net.ckeckNetwork()){
          this.util.showLoading(this.load_aguarde);
          this.codeProvider.code_remove(this.token,this.code_id,this.lang)
          .subscribe(
                (result: any) =>{
                  this.util.loading.dismiss(); 
                  if(result.status == 200){
                    this.toast.create({ message: this.excluir_msg, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                    this.events.publish('update_popover',this.code_id);
                    //this.navCtrl.setRoot(this.navCtrl.getActive().component,{token:this.token}); //atualiza apagina atual
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    this.navCtrl.push('LoginPage',{lang:this.lang});

                  }else{
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    
                  }

          } ,(error:any) => {
            this.toast.create({ message:this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
            this.util.loading.dismiss(); 
            this.navCtrl.setRoot('HomePage');
          });
        
   }else{
    this.navCtrl.setRoot('NotNetworkPage');
   } 
  }
  pushPage(){
  
    this.navCtrl.push('DetalheCodePage', {liberado:false,origem:2,lang:this.lang,token:this.token,
      code: this.codeNumber,
      latitude: "", longitude: "" ,
      telephone: ""
    });
  
  }
}

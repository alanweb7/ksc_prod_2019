import { Component } from '@angular/core';
import { HistoricoService } from '../../providers/historico/historico.service';
import { ToastController, NavController, NavParams, AlertController, ViewController, Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the PopoverFavComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover-fav',
  templateUrl: 'popover-fav.html'
})
export class PopoverFavComponent {

  text: string;
  visite_code: any;
  excluir_msg: any;
  msg_servidor: any;
  msg_exlcuir: any;
  btn_cancelar: any;
  btn_excluir: any;
  msg_erro: string;
  card: any;
  codeNumber: any;
  code_id: any;
  token: any;
  lang: any;

  constructor( public navCtrl        : NavController, 
    private events         : Events,
    public navParams      : NavParams,
    public alertCtrl      : AlertController,  private historico     : HistoricoService,
    public toast          : ToastController,
    public viewCtrl        : ViewController,

    private socialSharing : SocialSharing,) {
    console.log('Hello PopoverFavComponent Component');
    this.text = 'Hello World';
    this.msg_exlcuir         = this.navParams.get('msg_exlcuir');
    this.btn_cancelar         = this.navParams.get('btn_cancelar');
    this.btn_excluir         = this.navParams.get('btn_excluir');
    this.msg_servidor         = this.navParams.get('msg_servidor');
    this.excluir_msg         = this.navParams.get('excluir_msg');
    this.visite_code       = this.navParams.get('visite_code');
    this.card              = this.navParams.get('card');
    this.codeNumber        = this.navParams.get('codeNumber');
    this.code_id           = this.navParams.get('code_id');
    this.token           = this.navParams.get('token');
    this.lang           = this.navParams.get('lang');
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
         //console.log('Disagree clicked');
       }
     },
     {
       text: this.btn_excluir,
       handler: () => {
         this.removerFavorito();
       }
     }
   ]
 });
 confirm.present();


}  
removerFavorito() {
//grava o historico
this.historico.delete(this.code_id)
.then((remove: Boolean) => {
     if(remove){
      // this.navCtrl.setRoot(this.navCtrl.getActive().component); //atualiza apagina atual
      /// this.viewCtrl.dismiss();
       //this.navCtrl.setRoot("HistoricoPage",{token:this.token,lang:this.lang});
       this.events.publish('update',"true");
       this.toast.create({ message:this.excluir_msg, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
       
     }else{
       this.toast.create({ message: this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
       
     }

});

}
// compartilhar social share
shareSheetShare() {
console.log("card",this.card);
if(this.codeNumber != "" && this.codeNumber != null && this.codeNumber != undefined){
//remover os espaços em branco e trocar por _
this.codeNumber  = this.codeNumber.replace(/\s/g, "_");
console.log("card",this.codeNumber);
}

this.socialSharing.share(this.visite_code+"->", "Share subject",this.card, "https://kscode.com.br/card?code="+this.codeNumber).then(() => {
console.log("shareSheetShare: Success");
}).catch(() => {
console.error("shareSheetShare: failed");
});

}
}

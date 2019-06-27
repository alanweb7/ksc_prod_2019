import { Component } from '@angular/core';
import { IonicPage,Navbar , NavController, NavParams,AlertController, ToastController, PopoverController, ViewController, MenuController, Events, Popover } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { HistoricoService } from '../../providers/historico/historico.service';
import { Historico } from '../../models/historico.model';
import { ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { PopoverFavComponent } from '../../components/popover-fav/popover-fav';
@IonicPage({
  priority : 'off',
  segment  : 'Historico/:token',
  defaultHistory:['HomePage'],
  
})
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})
export class HistoricoPage {
  hist        : Historico[] = [];
  @ViewChild(Navbar) navBar: Navbar;
  endLat             : any;
  endLong            : any;
  token            : any;
  page;
  msg_exlcuir;
  btn_cancelar;
  btn_excluir;
  msg_erro    ;
  excluir_msg ;
  visite_code ;
  lang ;
  mostra;
  popover : Popover;
  constructor(
    public navCtrl        : NavController, 
    public navParams      : NavParams,
    public alertCtrl      : AlertController,
    private historico     : HistoricoService,
    public toast          : ToastController,
    public popoverCtrl: PopoverController,
    private socialSharing : SocialSharing,
    public viewCtrl        : ViewController,
    private geoProv       : GeolocationProvider,
    private event         : Events,
    public menu             : MenuController,
    private translate 	  : TranslateService

  ) {
    this.event.subscribe("update",(lang:any)=>{
      this.mostrarStorage();
      this.popover.dismiss();
    });
  }
  ionViewDidLoad() {
    this.token   = String;
    this.token   = "";
    this.token   = this.navParams.get('token');
    this.lang    = this.navParams.get('lang');
    this.mostra= "";
    
     this.navBar.backButtonClick = (e:UIEvent)=>{
      this.viewCtrl.dismiss();
     //quando clicla em voltar
  
     }  
   
  }

// capta o que tem no storage
  mostrarStorage(){
     this.historico.getAll()
     .then((movies:any) => {
         this.hist = movies;
     });
  } 
  fecharAvaliacao(){
    this.viewCtrl.dismiss();
  }
  pushGeoinfo(){
   
      this.geoProv.getGeolocation().then((resp:String[])=>{
        console.log('home',resp);
      
        this.endLat = resp["latitude"];
        this.endLong = resp["longitude"];
          console.log('home',this.endLat,this.endLong );
       });
   
  } 
  pushPage(codeNumber){

    console.log('historico sem gps');
      this.navCtrl.push('DetalheCodePage', {liberado:false,origem:3,lang:this.lang,token:this.token,
        code: codeNumber,
        latitude: this.endLat, longitude: this.endLong ,
        telephone: ""
      });
  

  }
  ionViewDidEnter() {
    //disabilita menu lateral
    this.menu.enable(true);
    //CHAMDA DO  BANCO DE DADOS
    this.mostrarStorage();
    this._translateLanguage();
    this.pushGeoinfo();
  
  } 
  showConfirm2(){
     this.mostra="true";
  }
  presentPopover(myEvent,code_id,codeNumber,card) {
    console.log(code_id,codeNumber);
    //this.token        = this.navParams.get('token');
    let popover = this.popoverCtrl.create(PopoverFavComponent,{btn_cancelar:this.btn_cancelar,btn_excluir:this.btn_excluir,msg_exlcuir:this.msg_exlcuir,excluir_msg:this.excluir_msg,msg_servidor:this.msg_erro,token:this.token,code_id:code_id,visite_code:this.visite_code,card:card,lang:this.lang,codeNumber:codeNumber});
    popover.present({
      ev: myEvent
    });
  }
//chamada alerta de confirmação antes de excluir
 showConfirm(id_serv,code,card) {
       const confirm = this.alertCtrl.create({
        /* title: this.msg_exlcuir,
        message: '', */
        //showBackdrop:false,
        //enableBackdrop:false,
        buttons: [
          {
            text: "Compartilhar",
            handler: () => {
              //console.log('Disagree clicked');
              this.shareSheetShare(code,card);
            }
          },
          {
            text: this.btn_excluir,
            handler: () => {
              this.removerFavorito(id_serv);
            }
          }
        ]
      });
      confirm.present();
  

}  
removerFavorito(id_serv) {
   //grava o historico
   this.historico.delete(id_serv)
   .then((remove: Boolean) => {
          if(remove){
            this.navCtrl.setRoot(this.navCtrl.getActive().component); //atualiza apagina atual
            this.toast.create({ message:this.excluir_msg, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
            
          }else{
            this.toast.create({ message: this.msg_erro, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
            
          }

    });
  
}
 // compartilhar social share
 shareSheetShare(code,card) {
   console.log("card",card);
   if(code != "" && code != null && code != undefined){
     //remover os espaços em branco e trocar por _
    code  = code.replace(/\s/g, "_");
     console.log("card",code);
   }
   
  this.socialSharing.share(this.visite_code+"->", "Share subject",card, "https://kscode.com.br/card?code="+code).then(() => {
    console.log("shareSheetShare: Success");
  }).catch(() => {
    console.error("shareSheetShare: failed");
  });

}
private _translateLanguage() : void
{
   this.translate.use(this.lang);
   console.log("linguagem",this.lang);
   this._initialiseTranslation();
}
private _initialiseTranslation() : void
{
   setTimeout(() =>
   {
      this.page           = this.translate.instant("default.page_fav");
      this.btn_cancelar   = this.translate.instant("default.btn_cancelar");
      this.btn_excluir    = this.translate.instant("default.btn_excluir");
      this.msg_exlcuir    = this.translate.instant("default.msg_exlcuir");
      this.msg_erro       = this.translate.instant("default.msg_erro");
      this.excluir_msg    = this.translate.instant("default.excluir_msg");
      this.visite_code    = this.translate.instant("default.visite_code");
   }, 250);
}


}

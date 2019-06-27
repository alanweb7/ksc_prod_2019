import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, ToastController, AlertController, Platform, ModalController, LoadingController, ActionSheetController, ViewController } from 'ionic-angular';
//import Provider
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from './../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the VideoListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-video-list',
  templateUrl: 'video-list.html',
})
export class VideoListPage {
  token        : any;
  id_code      : any;
  videos       : any[];
  package_codes          : Number;
  package_name       : String;
  videos_serve : any[];
  fullPath     : string;
  name         : String;
  localURL     : any;
  info         : any;
  size         : any;
  isConvertido : Number=3;
  alerte       : Alert;
  extension    : String;
  package_videos :Number;
  public progress: number = 0;
  isAdicionado  :number =  0;
  lang;
  load_enviando: any;
  msg_servidor: any;
  btn_cancelar: any;
  page: any;
  load_aguarde: any;
  msg_exlcuir: any;
  btn_publicar: any;
  btn_excluir: any;
  msg_pacote: any;
  vencimento: any;
  pacote: any;
  dias: any;
  link_video;
  link_texto: any;
  msg_erro: any;
  msg_video: any;
  aviso: any;
  btn_pausa: any;
  sim: any;
  nao: any;
  enviado_video: any;
  outro_video: any;
  selecione_video: any;
  btn_pausar: any;
  btn_continuar: any;
  btn_enviar: any;
  selecione: any;
  enviando: any;
  videos_name: any;
  link: any;
  galeria: string;
  constructor( 
            public navCtrl: NavController,
             public navParams: NavParams,
             private codeProvider   : CodeProvider,
             public  net            : NetworkProvider,
             public toast           : ToastController,
             private alertCtrl      : AlertController,
             public platform        : Platform,
             public modalCtrl       : ModalController,
             public loadingCtrl     : LoadingController,
             public actionSheetCtrl : ActionSheetController,
             public util            : UtilService,
             public viewCtrl        : ViewController,
             private translate 	  : TranslateService
             ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoListPage');
    this.token         = String;
    this.id_code       = String;
    this.id_code       = "";
    this.token         = "";
    this.package_codes = 0;
    this.package_name  = "";
    this.token         = this.navParams.get('token');
    this.id_code       = this.navParams.get('code');
    
    this.package_codes = this.navParams.get('package_codes');
    this.package_name  = this.navParams.get('package_name');
    this.package_videos = this.navParams.get('package_videos');
    this.lang           = this.navParams.get('lang');
    this._translateLanguage();
  }
  private ionViewDidEnter() {
    this.getShow();
    //.slider.slideTo(1);
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
         this.page             = this.translate.instant("default.videos");
         this.btn_cancelar     = this.translate.instant("default.btn_cancelar");
         this.msg_servidor     = this.translate.instant("default.msg_servidor");
         this.load_enviando    = this.translate.instant("default.load_enviando");
         this.load_aguarde     = this.translate.instant("default.load_aguarde");
         this.load_enviando    = this.translate.instant("default.load_enviando");
         this.msg_exlcuir      = this.translate.instant("default.msg_exlcuir");
         this.btn_publicar     = this.translate.instant("default.btn_publicar");
         this.btn_excluir      = this.translate.instant("default.btn_excluir");
         this.msg_pacote       = this.translate.instant("default.msg_pacote");
         this.vencimento       = this.translate.instant("default.vencimento");
         this.pacote           = this.translate.instant("default.pacote");
         this.videos_name           = this.translate.instant("default.videos");
         this.dias             = this.translate.instant("default.dias");
         this.info             = this.translate.instant("default.info");
         this.link_video       = this.translate.instant("videos.link_video");
         this.link_texto       = this.translate.instant("videos.link_texto");
         this.msg_erro         = this.translate.instant("default.msg_erro");
         this.msg_video        = this.translate.instant("default.msg_video");
         this.aviso            = this.translate.instant("default.aviso");
         this.btn_pausa        = this.translate.instant("videos.btn_pausar");
         this.sim              = this.translate.instant('default.sim');
         this.nao              = this.translate.instant('default.nao');
         this.enviado_video    = this.translate.instant('videos.enviado_video');
         this.outro_video      = this.translate.instant('videos.outro_video') ;
         this.selecione_video  = this.translate.instant('videos.selecione_video');
         this.btn_pausar       = this.translate.instant('videos.btn_pausar');
         this.btn_continuar    = this.translate.instant('default.btn_continuar');
         this.btn_enviar       = this.translate.instant('push.btn_enviar');
        // this.selecione       = this.translate.instant('videos.selecione');
         this.enviando       = this.translate.instant('videos.enviando');
         this.link          = this.translate.instant('videos.link');
         this.selecione          = this.translate.instant('videos.selecione');
         this.galeria          = this.translate.instant('videos.galeria');
       
      }, 250);
   }
  onActionSheet(): void {
    this.actionSheetCtrl.create({
      title: this.selecione,
      buttons: [
        {
          text: this.link,
          handler: () => {
            
              this.showPrompt();
          }
        },
        {
          text: this.galeria,
          handler: () => {
            this.uploadVideo();
          }
        }/* ,
         {
          text: 'Camera',
          handler: () => {
            this.VideoCapture();
          }
        },   */
        ,
        {
          text: this.btn_cancelar
        }
      ]
    }).present();
  }
  showPrompt() {
    const prompt = this.alertCtrl.create({
        //title: 'Escolha o seu CODE',
        message: this.link_video,
        inputs: [
          {
            name: 'link',
            placeholder: this.link_texto
          }
        ],
        buttons: [
          {
            text: this.btn_cancelar,
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: this.btn_enviar,
            handler: data => {
              console.log('Saved clicked',data.link);
              this.insertVideoLinkArray(data.link);
            }
          }
        ]
      });
      prompt.present();
}
showConfirm(id_img) {
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
         this.video_delete(id_img);
       }
     }
   ]
 });
 confirm.present();
} 
ShowVideo(video){
  let myModal =this.modalCtrl.create('VideoShowPage',{videos:video});
  myModal.present();
}
uploadVideo(){
   this.navCtrl.push('VideCodeFirebasePage',{videos:this.videos,token:this.token,code:this.id_code,package_videos:this.package_videos,package_name:this.package_name, lang:this.lang,
    load_enviando:this.load_enviando,
    msg_servidor: this.msg_servidor,
    btn_cancelar: this.btn_cancelar,
    page: this.page,
    load_aguarde: this.load_aguarde,
    msg_exlcuir: this.msg_exlcuir,
    btn_publicar: this.btn_publicar,
    btn_excluir: this.btn_excluir,
    msg_pacote: this.msg_pacote,
    vencimento: this.vencimento,
    pacote: this.pacote,
    dias: this.dias,
    aviso: this.aviso,
    msg_video: this.msg_video,
    sim: this.sim,
    nao: this.nao,
    enviado_video: this.enviado_video,
    outro_video: this.outro_video,
    selecione_video: this.selecione_video,
    btn_pausar:this.btn_pausar,
    videos_name:this.videos_name,
    btn_continuar:this.btn_continuar,
    btn_enviar:this.btn_enviar,selecione:this.selecione,enviando:this.enviando});
 //  let myModal =this.modalCtrl.create('VideCodeFirebasePage',{videos:this.videos,token:this.token,code:this.id_code,package_videos:this.package_videos,package_name:this.package_name});
   //myModal.present();
  // this.viewCtrl.dismiss();
 }
public insertVideoLinkArray(link){
  this.util.showLoading(this.load_enviando);
    if(this.net.ckeckNetwork()){
      
          this.codeProvider.video_link_create(this.id_code,this.token,link,"",this.lang) 
           .subscribe(
              (result: any) =>{    
                this.util.loading.dismiss(); 
                if(result.status == 200){
                  console.log("result delete code",result);
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                  //this.vidbase64 = result.midias;
                 // this.getVideoServe();
                }else if(result.status == 402){
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                  this.navCtrl.push('LoginPage',{lang:this.lang});
                }
                else if(result.status == 403){
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                }

           } ,(error:any) => {
            this.toast.create({ message:this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
            this.util.loading.dismiss(); 
            this.navCtrl.setRoot('HomePage');
           });

    }else{
      this.util.loading.dismiss(); 
        this.navCtrl.setRoot('NotNetworkPage');
    } 
 
}
validaPacote(){
  console.log();
  if(this.videos.length > 0){
    if(this.videos.length >= this.package_videos ){
      const alert = this.alertCtrl.create({
        title: this.aviso,
       // subTitle: this.msg_video+"<br>"+this.pacote+":"+this.package_name+'<br>'+this.codes+' CODES<br>'+this.codes_videos+" "+this.videos+' CODE<br>'+this.vencimento+":"+this.code_expiratiion+' '+this.dias,
  
        subTitle: this.msg_video+'<br>'+this.pacote+' :'+this.package_name+'<br>'+this.videos_name+' CODE: '+this.package_videos,
        buttons: ['OK']
      });
      alert.present();
    }else{
        this.onActionSheet();
        //this.viewCtrl.dismiss();
    }
  }else {
    this.onActionSheet();
     //this.viewCtrl.dismiss();
 } 

}
getShow(){
  this.util.showLoading(this.load_aguarde);
  if(this.net.ckeckNetwork()){
       // this.util.showLoading("Aguarde...");
        this.codeProvider.getShowCode(this.id_code)
        .subscribe(
              (result: any) =>{
             
                console.log("result",result);
                if(result.status == 200){  
                  this.util.loading.dismiss(); 
                  this.videos              = result.data[0]['album_vimeo'];
                  console.log(this.videos);
                 // this.getVideoServe();
                     
       
                }else{
                  this.toast.create({ message: this.msg_erro, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  
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
video_delete(id_code){
  if(this.net.ckeckNetwork()){
        this.util.showLoading(this.load_aguarde);
        this.codeProvider.video_delete(this.token,id_code,this.lang)
        .subscribe(
              (result: any) =>{
                this.util.loading.dismiss(); 
                if(result.status == 200){
                  console.log("result delete code",result);
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                  if(result.midias.length > 0){
                    //this.vidbase64 =result.midias;
                     this.videos=result.midias;
                     //this.removeItemArray(id_code);
                     console.log("entrei aqui",id_code);
                   // this.getVideoServe();
                  }else{
                    this.videos = [];
                   
                  }
                 
                }else if(result.status == 402){
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                  this.navCtrl.push('LoginPage',{lang:this.lang});
                }
                else if(result.status == 403){
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
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform ,App, ViewController,LoadingController, ToastController, AlertController, ModalController} from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { TranslateService } from '@ngx-translate/core';
//Import Provider
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from '../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';
@IonicPage({
  priority : 'off',
  segment  : 'ImageCode/:imagens/:code/:token/:qtd/:pacote/:lang',
  defaultHistory:['MenuCodePage']
})
@Component({
  selector: 'page-image-code',
  templateUrl: 'image-code.html',
})
export class ImageCodePage {

  images        : any[];
  imagesbase64  : String;
  caminho       : any[];
  token         : any;
  id_code       : any;
  qtd           : Number;
  pacote        : String;
  control_reverse :Boolean;
  package_name: String;
  package_imagens: Number;
  //tradução
  lang;
  page: any;
  btn_cancelar: any;
  msg_servidor: any;
  load_enviando: any;
  load_aguarde: any;
  msg_exlcuir: any;
  btn_publicar: any;
  btn_excluir: any;
  msg_pacote: any;
  vencimento: any;
  image_name: any;
  dias: any;
  info: any;
  galeria: any;
  camera: any;
  msg_erro: any;
  aviso: any;
  msg_image: any;
  selecione;
  arq_selecione: any;

  constructor(
    public navCtrl         : NavController, 
    public navParams       : NavParams, 
    public platform        : Platform,
    public viewCtrl        : ViewController,
    public appCtrl         : App,
    private photoViewer    : PhotoViewer,
    private codeProvider   : CodeProvider,
    public  net            : NetworkProvider,
    public toast           : ToastController,
    public alertCtrl       : AlertController,
    public loadingCtrl     : LoadingController,
    public modalCtrl       : ModalController,
    public util            : UtilService,
    private translate 	  : TranslateService
             ) {
  }

  ionViewDidLoad(){
    this.images       = [];
    this.caminho      = [];
    this.token        = String;
    this.id_code      = String;
    this.pacote       = "";
    this.id_code      = "";
    this.token        = "";
    this.imagesbase64 = "";
    this.qtd          = 0;
    //this.imagesbase64 = this.navParams.get('imagens');
    this.token             = this.navParams.get('token');
    this.id_code           = this.navParams.get('code');
    this.package_name      = this.navParams.get('package_name');
    this.package_imagens   = this.navParams.get('package_imagens');
    this.lang              = this.navParams.get('lang');
    console.log("lang",this.lang);
    this.getImagenServe();
    this.control_reverse   = true;
    this._translateLanguage()
  }
  //fazer o start do slide
 ionViewDidEnter() {
  this.getShowCode();
 
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
       this.page             = this.translate.instant("default.imagem");
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
       this.image_name       = this.translate.instant("default.imagem");
       this.dias             = this.translate.instant("default.dias");
       this.info             = this.translate.instant("default.info");
       this.galeria          = this.translate.instant("image.galeria");
       this.camera           = this.translate.instant("image.camera");
       this.msg_erro         = this.translate.instant("default.msg_erro");
       this.msg_image        = this.translate.instant("image.msg");
       this.aviso            = this.translate.instant("default.aviso");
       this.selecione        = this.translate.instant("videos.selecione");
       this.arq_selecione    = this.translate.instant("image.arq_selecione");
   
    }, 250);
 }
  ShowCam(){

 this.navCtrl.push('ImageAddPage',{
      imagens:this.images,
      token:this.token,
      code:this.id_code,
      package_imagens:this.package_imagens,
      package_name:this.package_name,
      page: this.page,
      btn_cancelar: this.btn_cancelar,
      msg_servidor: this.msg_servidor,
      load_enviando: this.load_enviando,
      load_aguarde: this.load_aguarde,
      msg_exlcuir: this.msg_exlcuir,
      btn_publicar: this.btn_publicar,
      btn_excluir: this.btn_excluir,
      msg_pacote: this.msg_pacote,
      vencimento: this.vencimento,
      image_name: this.image_name,
      dias: this.dias,
      info: this.info,
      galeria: this.galeria,
      camera: this.camera,
      msg_erro: this.msg_erro,
      aviso: this.aviso,
      msg_image: this.msg_image,
      selecione :this.selecione,
      pacote: this.pacote,
      arq_selecione:this.arq_selecione,
      lang:this.lang
    });
   // myModal.present();
   // this.viewCtrl.dismiss();
    
  }
 getImagenServe(){
   if(this.imagesbase64 != "" && this.imagesbase64 != null){
        this.images=[];
        for (let i = 0; i < this.imagesbase64.length; i++) {
            this.images.push(this.imagesbase64[i]);
       }
        this.imagesbase64="";
    }
 }

 getShowCode(){
  if(this.net.ckeckNetwork()){
        this.util.showLoading(this.load_aguarde);
        this.codeProvider.getShowCode(this.id_code)
        .subscribe(
              (result: any) =>{
                this.util.loading.dismiss(); 
                console.log("result",result);
                if(result.status == 200){  
                  this.images              = result.data[0]['galeria'];
                  this.getImagenServe();
                     
       
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
 //chamada alerta de confirmação antes de excluir
 showConfirm(id_img) {
  const confirm = this.alertCtrl.create({
   title: this.msg_exlcuir,
   message: '',
   buttons: [
     {
       text: this.btn_cancelar,
       handler: () => {
        
       }
     },
     {
       text: this.btn_excluir,
       handler: () => {
         this.imagen_delete(id_img);
       }
     }
   ]
 });
 confirm.present();
} 
//visualizar foto tamnho maior
viewPhoto(img){
  this.photoViewer.show(img);
}
imagen_delete(id_img){
  if(this.net.ckeckNetwork()){
        this.util.showLoading(this.load_aguarde);
        this.codeProvider.imagen_delete(this.token,id_img,this.lang)
        .subscribe(
              (result: any) =>{
               this.util.loading.dismiss(); 
                if(result.status == 200){
                
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                  this.imagesbase64="";
                  if(result.midias.length > 0){
                    this.imagesbase64 =result.midias;
                    this.getImagenServe();
                  }else{
                    this.images = [];
                   
                  }
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                    this.navCtrl.push('LoginPage',{lang:this.lang});
                  }
                  else if(result.status == 403){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  }

        } ,(error:any) => {
          this.toast.create({ message: this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
              
        });
      
  }else{
    this.navCtrl.setRoot('NotNetworkPage');
  } 
}

  
}

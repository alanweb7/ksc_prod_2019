import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController } from 'ionic-angular';
//Import Native
import { Camera, CameraOptions } from "@ionic-native/camera";
import { BrowserTab } from '@ionic-native/browser-tab';
//Import Provider
import { UtilService } from '../../providers/util/util.service';
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from '../../providers/code/code';

import { FilePath } from '@ionic-native/file-path';
import { Chooser } from '@ionic-native/chooser';
@IonicPage({
  priority : 'off',
  segment  : 'DocumentoCode/:docs/:code/:token/:qtd/:pacote/:load_aguarde/:btn_cancelar/:btn_excluir/:btn_publicar/:page/:msg_exlcuir/:load_enviando/:msg_servidor/:aviso/:arq_msg/:arq_invalido/:lang',
  defaultHistory:['MenuCodePage']
})
@Component({
  selector: 'page-documento-code',
  templateUrl: 'documento-code.html',
})
export class DocumentoCodePage {
  token      : any;
  id_code    : any;
  docs       : any[];
  docbase64  : String;
  caminho    : any[];
  url        : any;
  qtd        : Number;
  pacote     : String;
  page;
  btn_publicar;
  msg_exlcuir;
  btn_cancelar;
  btn_excluir;
  load_aguarde;
  load_enviando;
  msg_servidor;
  aviso;
  msg_aviso;
  arq_invalido;
	arq_msg;
  lang: any;
  
  constructor(
               public navCtrl        : NavController,
               public navParams      : NavParams,
               private codeProvider  : CodeProvider,
               public  net           : NetworkProvider,
               public camera         : Camera, 
               private browserTab    : BrowserTab,
               public toast          : ToastController,
               public util           : UtilService,
               private alertCtrl     : AlertController,  
               private filePath: FilePath,
               private chooser: Chooser
            
              ) {
  }

  ionViewDidLoad() {
    this.caminho        = [];
    this.docs           = [];
    this.caminho        = [];
    this.token          = String;
    this.id_code        = String;
    this.url            = String;
    this.url            = "";
    this.id_code        = "";
    this.token          = "";
    this.qtd            = 0;
    this.docbase64      = "";
    this.pacote         = "";
    this.docbase64      = this.navParams.get('docs');
    this.token          = this.navParams.get('token');
    this.id_code        = this.navParams.get('code');
    this.qtd            = this.navParams.get('qtd');
    this.pacote         = this.navParams.get('pacote');
    this.load_aguarde   = this.navParams.get('load_aguarde');
    this.btn_cancelar   = this.navParams.get('btn_cancelar');
    this.btn_excluir    = this.navParams.get('btn_excluir');
    this.btn_publicar   = this.navParams.get('btn_publicar');
    this.page           = this.navParams.get('page');
    this.msg_exlcuir    = this.navParams.get('msg_exlcuir');
    this.load_enviando  = this.navParams.get('load_enviando');
    this.msg_servidor   = this.navParams.get('msg_servidor');
    this.aviso          = this.navParams.get('aviso');
    this.msg_aviso      = this.navParams.get('msg_aviso');
    this.arq_msg        = this.navParams.get('arq_msg');
    this.arq_invalido   = this.navParams.get('arq_invalido');
    this.lang   = this.navParams.get('lang');
    this.getDocServe();
  }
  //chamada alerta de confirmação antes de excluir
  showConfirm(id_code) {
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
           this.doc_delete(id_code);
         }
       }
     ]
   });
   confirm.present();
  
  
  } 
  open_file(){
    this.chooser.getFile('application/pdf')
.then(file => {
  let base64 = file.dataURI.replace('data:application/pdf;base64,','');
  console.log(file ? file : 'canceled');
  console.log(base64);
  this.filePath.resolveNativePath(file.uri).then((file:any)=>{
    console.log(file);
    this.caminho.push({files:base64,file_name:file});
    this.docs.push({id: "",doc_link:file,file_name:file});
  })
 
})
.catch((error: any) => console.error(error));
  

  }
  doc_delete(id_code){
    if(this.net.ckeckNetwork()){
          this.util.showLoading(this.load_aguarde);
          this.codeProvider.doc_delete(this.token,id_code,this.lang)
          .subscribe(
                (result: any) =>{
                  this.util.loading.dismiss(); 
                  if(result.status == 200){
                    console.log("result delete code",result);
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                    this.docbase64 = result.midias;
                    this.getDocServe();
                  }else if(result.status == 402){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                    this.navCtrl.push('LoginPage',{lang:this.lang});
                  }
                  else if(result.status == 403){
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  }

          } ,(error:any) => {});
        
   }else{
    
    this.navCtrl.setRoot('NotNetworkPage');
   } 
  }
  getDocServe(){
    this.docs =[];
    if(this.docbase64 != "" && this.docbase64 != null){
         for (let i = 0; i < this.docbase64.length; i++) {
            this.docs.push(this.docbase64[i]);
          }
         this.docbase64 ="";
       
    }
  }
  private takePicture(): void {

    const options: CameraOptions = {
      quality: 100,
      allowEdit:true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.ALLMEDIA,
      saveToPhotoAlbum: true
    }
  
     this.camera.getPicture(options).then((imageData) => {
          if(this.util.getExtension(imageData) != '.pdf'){
            let alert = this.alertCtrl.create({
              title: this.arq_invalido,
              subTitle: this.arq_msg+' PDF',
              buttons: ['OK']
            });
            alert.present();
          }else{
            this.docs.push({id: "",doc_link:imageData,file_name:imageData});
            //converter base64
            this.util.converterBase64(imageData).then((base64:any) => {
                base64.replace('', '+');
                this.caminho.push({files:base64,file_name:imageData});
            });
              
      
          }

    }, (err) => {
     // Handle error
    });
  
  

  }
 enviar(){
    this.util.showLoading(this.load_enviando);
    if(this.caminho.length >0){
        if(this.net.ckeckNetwork()){
              this.codeProvider.doc_create(this.id_code,this.token,this.caminho,this.lang) 
              .subscribe(
                    (result: any) =>{
                      if(result.status == 200){
                        this.util.loading.dismiss(); 
                        this.docbase64    = "";
                        this.caminho      = [];
                        this.docbase64    = result.midias;
                        this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
               
                        this.getDocServe();
                      }
                      else if(result.status == 402){
                        this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                        this.navCtrl.push('LoginPage',{lang:this.lang});
                      }
                      else if(result.status == 403){
                        this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                      }
                      
                  },(error:any) => {
                      this.util.loading.dismiss();  
                      this.toast.create({ message: this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'erro'  }).present();
                  });   
        } else{
                this.util.loading.dismiss();
                this.navCtrl.setRoot('NotNetworkPage');
           }   
    }else{
        
        this.util.loading.dismiss();
              let alert = this.alertCtrl.create({
                title: this.aviso,
                subTitle: this.msg_aviso,
                buttons: ['OK']
              });
              alert.present();
    }
  }

  viewPDF(url){
    this.browserTab.isAvailable()
    .then(isAvailable => {
      if (isAvailable) {
        this.browserTab.openUrl('https://docs.google.com/viewer?url='+url);
      } 
    });

  }
  
}

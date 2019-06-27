import { Component, Inject, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Events, Navbar, ViewController } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';
//import firebase from 'firebase';
import * as firebase from 'firebase';

//import Provider
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from './../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';
import { File, Entry } from '@ionic-native/file';


@IonicPage()
@Component({
  selector: 'page-vide-code-firebase',
  templateUrl: 'vide-code-firebase.html',
})
export class VideCodeFirebasePage {
  @ViewChild(Navbar) navBar: Navbar;
  referencia;
  arquivo;
  porc;
  total;
  uploadTask;
  token          : any;
  id_code        : any;
  videos         : any[];
  package_codes  : Number;
  package_name   : String;
  package_videos : Number;
  porcentagem;
  ispause        : String = "";
  isResume       : String = "";
  isEnviando     : String = "";
  isCancel       : String = "";
  isConvertido : Number=3;
  fullPath;
  selecionado :String="true";
  name:string;
  //tradução
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
  aviso: any;
  msg_video: string;
  sim: string;
  nao: string;
  enviado_video: string;
  outro_video: string;
  selecione_video: string;
  btn_pausar: any;
  btn_continuar: any;
  btn_enviar: any;
  selecione: any;
  enviando: any;
  constructor(@Inject(FirebaseApp) fb : any,
              public navCtrl          : NavController, 
              public navParams        : NavParams,
              private alertCtrl       : AlertController,
              public toast           : ToastController,
              public file            : File,
              public  net            : NetworkProvider,
              private codeProvider   : CodeProvider,
              public util            : UtilService,
              public  viewCtrl      : ViewController, 
              public events: Events
              ) {
    this.referencia = firebase.storage().ref();   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
    this.token          = String;
    this.id_code        = String;
    this.id_code        = "";
    this.token          = "";
    this.videos         = [];
    this.package_codes  = 0;
    this.name           = "";
    this.package_name   = "";
    this.videos         = this.navParams.get('videos');
    this.token          = this.navParams.get('token');
    this.id_code        = this.navParams.get('code');
    this.package_codes  = this.navParams.get('package_codes');
    this.package_name   = this.navParams.get('package_name');
    this.package_videos = this.navParams.get('package_videos');
    this.lang           = this.navParams.get('lang');
    this.load_enviando  = this.navParams.get('load_enviando');
    this.msg_servidor   = this.navParams.get('msg_servidor');
    this.btn_cancelar   = this.navParams.get('btn_cancelar');
    this.page           = this.navParams.get('page');
    this.load_aguarde   = this.navParams.get('load_aguarde');
    this.msg_exlcuir    = this.navParams.get('msg_exlcuir');
    this.btn_publicar   = this.navParams.get('btn_publicar');
    this.btn_excluir    = this.navParams.get('btn_excluir');
    this.msg_pacote     = this.navParams.get('msg_pacote');
    this.vencimento     = this.navParams.get('vencimento');
    this.pacote         = this.navParams.get('pacote');
    this.dias           = this.navParams.get('dias');
    this.aviso          = this.navParams.get('aviso');
    this.msg_video      = this.navParams.get('msg_video');
    this.sim            = this.navParams.get('sim');
    this.nao            = this.navParams.get('nao');
    this.enviado_video  = this.navParams.get('enviado_video');
    this.outro_video    = this.navParams.get('outro_video') ;
    this.selecione_video = this.navParams.get('selecione_video');
    this.btn_pausar      =  this.navParams.get('btn_pausar');
    this.btn_continuar      =  this.navParams.get('btn_continuar');
    this.btn_enviar      =  this.navParams.get('btn_enviar');
    this.btn_enviar      =  this.navParams.get('btn_enviar');
    this.selecione      =  this.navParams.get('selecione');
    this.enviando      =  this.navParams.get('enviando');
    this.lang          =  this.navParams.get('lang');
    console.log(this.package_videos);
  /*   this.navBar.backButtonClick = (e:UIEvent)=>{
      this.events.publish('updateScreen');
     
     }   */
  }
 
  enviarArquivo(){
    if(this.net.ckeckNetwork()){
          if(this.arquivo == ""){
            const alert = this.alertCtrl.create({
              title: this.aviso,
              subTitle: this.selecione_video,
              buttons: ['OK']
            });
            alert.present();

          }else{

          
                      let caminho     = this.referencia.child('pasta/'+this.arquivo.name);
                      this.uploadTask = caminho.put(this.arquivo);
                      this.uploadTask.on('state_changed', (snapshot)=>{
                      // Acompanha os estados do upload (progresso, pausado,...)
                      console.log(snapshot);
                      this.ispause    = "true";
                      this.isEnviando = "";
                      this.selecionado = "";
                      this.isCancel   = "true";
                      this.porc       = snapshot.bytesTransferred;
                      this.total      = snapshot.totalBytes;
                      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                      this.porcentagem = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      this.porcentagem = this.porcentagem.toPrecision(3);
                      if(this.porcentagem == 100){
                        this.isCancel   ="";
                        this.isEnviando = "true";
                        this.isResume   = "";
                        this.ispause    = "";
                        this.arquivo = "";
                        
                      
                        this.getUploadVideo(this.name);
                        //this.getVideo(this.name);
                        
                        //this.toast.create({ message:  "O Vídeo foi enviado com sucesso !", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                          
                      }
                        console.log(); 
                      //var splitted = this.porcentagem.split(".", 2); 
                      //  console.log(splitted);
                          console.log('Upload is ' + this.porcentagem + '% done');
                          switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                              console.log('Upload is paused');
                              // this.isResume = "true";
                              break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                              console.log('Upload is running');
                              //this.ispause="true";
                              //this.isResume = "";
                              break;
                          }
                    }, function(error) {
                
                      // A full list of error codes is available at
                      // https://firebase.google.com/docs/storage/web/handle-errors
                      switch (error.code) {
                        case 'storage/unauthorized':
                          // User doesn't have permission to access the object
                          console.log('unauthorized');
                          this.isCancel="";
                          this.isEnviando = "";
                          this.isResume = "";
                          this.ispause = "";
                          //this.toast.create({ message: this.erro_envio, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'erro'  }).present();
                    
                          break;
                    
                        case 'storage/canceled':
                          // User canceled the upload
                          console.log('cancelado');
                          this.isCancel   ="";
                          this.isEnviando = "";
                          this.isResume   = "";
                          this.ispause    = "";
                          //this.toast.create({ message:this.erro_envio, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'erro'  }).present();
                    
                          break;
                    
                        
                    
                        case 'storage/unknown':
                          // Unknown error occurred, inspect error.serverResponse
                          console.log('unknown');
                          this.isCancel   ="";
                          this.isEnviando = "";
                          this.isResume   = "";
                          this.ispause    = "";
                          //this.toast.create({ message: this.erro_envio, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'erro'  }).present();
                    
                          break;
                      }
                    });
                  }
                }else{
                    this.util.loading.dismiss(); 
                      this.navCtrl.setRoot('NotNetworkPage');
                  }               

  }
  
  deleteArqui(){
    const images = firebase.storage().ref().child('pasta');
    const image = images.child('1553352893853.mp4');
    image.delete().then((url) => {
      console.log(url);
     });
    /* image.getDownloadURL().then((url) => {
         console.log(url);
    }); */
  }
  closeModal() {
    this.navCtrl.pop();
    this.events.publish('updateScreen');
    //this.navCtrl.push('VideoCodePage',{videos:this.videos,token:this.token,code:this.id_code,package_videos:this.package_videos,package_name:this.package_name});
    
  }
  uploadPause(){
    // Pause the upload
    this.uploadTask.pause();
    this.ispause = "";
    this.isResume="true";
    this.isCancel="true";
   
}
uploadResume(){
this.uploadTask.resume();
this.ispause ="true";
this.isCancel="true";
this.isResume ="";
}

uploadCancel(){
this.uploadTask.cancel();
  this.arquivo="";
  this.ispause ="";
this.isCancel="";
this.isResume ="";
this.selecionado="asd";
this.porcentagem ="";
this.name="";
}
  atualizaArquivo(event){

    if(this.videos.length > 0){
      console.log("entrei aqui no >0",this.videos.length);
      if(this.videos.length >= this.package_videos){
        const alert = this.alertCtrl.create({
          title: this.aviso,
          subTitle: this.msg_video+'<br>'+this.pacote+' :'+this.package_name+'<br>'+this.videos+' CODE: '+this.package_videos,
          buttons: ['OK']
        });
        alert.present();
      }else{
        console.log("entrei aqui no ==");
        this.arquivo = event.srcElement.files[0];
        this.isEnviando = "true";
        this.name = this.arquivo.name;
        console.log(this.name);
        this.isCancel   ="";
        this.isResume   = "";
        this.ispause    = ""; 
        console.log(event);
      }
    }else {
      console.log("entrei aqui no else");
      this.arquivo = event.srcElement.files[0];
      this.isEnviando = "true";
      this.name = this.arquivo.name;
      console.log(this.name);
      this.isCancel   ="";
      this.isResume   = "";
      this.ispause    = ""; 
      console.log(event);
   } 
  
  }
  getUploadVideo(video){
    console.log(video);
    //this.getVideo(video);
    if(this.net.ckeckNetwork()){
    const images = firebase.storage().ref().child('pasta');
    let vi = this.name;
    const image = images.child(vi.toString());
    image.getDownloadURL().then((url) => {
      console.log(url);
      this.util.showLoading(this.load_enviando);
  
         
              console.log(url);
              this.codeProvider.video_link_create(this.id_code,this.token,url,"firebase",this.lang) 
                .subscribe(
                    (result: any) =>{    
                      this.util.loading.dismiss(); 
                      if(result.status == 200){
                        console.log("result delete code",result);
                        this.selecionado="true";
                        this.name = "";
                        this.porcentagem="";
                        //this.closeModal();
                       
                        //this.navCtrl.push('VideoCodePage',{videos:result.midias,token:this.token,code:this.id_code,package_videos:this.package_videos,package_name:this.package_name});
  
                        this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                        this.case_upload();
                      }else if(result.status == 402){
                        this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                        this.navCtrl.push('LoginPage',{lang:this.lang});
                      }
                      else if(result.status == 403){
                        this.selecionado="true";
                        this.name = "";
                        this.porcentagem="";
                        this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                      }
              },(error:any) => {
                //this.toast.create({ message: 'Não conseguimos conectar ao servidor !', position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                this.util.loading.dismiss(); 
                //this.navCtrl.setRoot('HomePage');
                this.tentar_video();
          
              }); 
        
    }).catch(() => {
      //this.selecionado="true";
      //this.name = "";
      //.toast.create({ message: "Não conseguimos completar o envio do seu vídeo", position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
         // this.tentar_video();  
         this.getUploadVideo(this.name);
    })  ;
    
        }else{
          this.util.loading.dismiss(); 
            this.navCtrl.setRoot('NotNetworkPage');
        }    
  }
  tentar_video() {
    const prompt = this.alertCtrl.create({
      title: 'Aviso',
      message: "Não conseguimos completar o envio do seu vídeo",
    /*   inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ], */
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
            this.selecionado="true";
            this.name = "";
            this.porcentagem="";
          }
        },
        {
          text: 'Tentar novamente',
          handler: data => {
            console.log('Saved clicked');
            this.getUploadVideo(this.name);
          }
        }
      ]
    });
    prompt.present();
  }
  case_upload() {
    const prompt = this.alertCtrl.create({
      title: this.enviado_video,
      message: this.outro_video,
    /*   inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ], */
      buttons: [
        {
          text: this.nao,
          handler: data => {
            /* console.log('Cancel clicked');
            this.selecionado="true";
            this.name = "";
            this.porcentagem=""; */
            this.viewCtrl.dismiss();
          }
        },
        {
          text: this.sim,
          handler: data => {
            //console.log('Saved clicked');
            //this.getUploadVideo(this.name);
          }
        }
      ]
    });
    prompt.present();
  }
  getSizeAq(){
    this.file.resolveLocalFilesystemUrl(this.fullPath).then((res: Entry) => {
      res.getMetadata((metadata) => {
         this.total = metadata.size;
         console.log("size",metadata.size);
      });
    })
}

  getVideo(video) {
    const images = firebase.storage().ref().child('pasta');
    const image = images.child("VID-20190329-WA0030.mp4");
    image.getDownloadURL().then((url) => {
         console.log(url);
    });
  }
 
}

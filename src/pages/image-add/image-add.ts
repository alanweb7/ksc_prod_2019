import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ToastController, LoadingController, reorderArray, ViewController } from 'ionic-angular';
import { Camera, CameraOptions} from "@ionic-native/camera";
import { ImagePicker } from '@ionic-native/image-picker';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { CodeProvider } from '../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
@IonicPage({
  priority : 'off',
  segment  : 'ImageAdd/:imagens/:code/:token/:qtd/:pacote',
  defaultHistory:['ImageCodePage']
})
@Component({
  selector: 'page-image-add',
  templateUrl: 'image-add.html',
})
export class ImageAddPage {
  images        : any[];
  imagesbase64  : String;
  caminho       : any[];
  token         : any;
  id_code       : any;
  qtd           : Number;
  package_name   : String;
  package_imagens :Number;
 //tradução
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
 camera_btn: any;
 msg_erro: any;
 aviso: any;
 msg_image: any;
  selecione: any;
  pacote;
  arq_selecione: string;
  lang: String;
  constructor(public navCtrl         : NavController,
              public navParams       : NavParams,
              public alertCtrl       : AlertController,
              public actionSheetCtrl : ActionSheetController,
              public imagePicker     : ImagePicker,
              private photoViewer    : PhotoViewer,
              private codeProvider   : CodeProvider,
              public  net            : NetworkProvider,
              public toast           : ToastController,
              public camera          : Camera, 
              public viewCtrl        : ViewController,
              public loadingCtrl     : LoadingController,
              public util            : UtilService,
 
            
            ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageAddPage');
    this.images            = [];
    this.caminho           = [];
    this.token             = String;
    this.id_code           = String;
    this.package_name      = "";
    this.package_imagens   =0;
    this.id_code           = "";
    this.token             = "";
    this.imagesbase64      = "";
    this.qtd               = 0;
    this.imagesbase64      = this.navParams.get('imagens');
    this.token             = this.navParams.get('token');
    this.id_code           = this.navParams.get('code');
    this.package_name      = this.navParams.get('package_name');
    this.package_imagens   = this.navParams.get('package_imagens');
    this.page = this.navParams.get('page');;
    this.btn_cancelar = this.navParams.get('btn_cancelar');;
    this.msg_servidor = this.navParams.get('msg_servidor');;
    this.load_enviando = this.navParams.get('load_enviando');;
    this.load_aguarde = this.navParams.get('load_aguarde');;
    this.msg_exlcuir = this.navParams.get('msg_exlcuir');;
    this.btn_publicar = this.navParams.get('btn_publicar');;
    this.btn_excluir = this.navParams.get('btn_excluir');;
    this.msg_pacote = this.navParams.get('msg_pacote');;
    this.vencimento = this.navParams.get('vencimento');;
    this.image_name = this.navParams.get('image_name');;
    this.dias = this.navParams.get('dias');;
    this.info = this.navParams.get('info');;
    this.galeria = this.navParams.get('galeria');;
    this.camera_btn = this.navParams.get('camera');;
    this.msg_erro = this.navParams.get('msg_erro');;
    this.aviso = this.navParams.get('aviso');;
    this.msg_image = this.navParams.get('msg_image');;
    this.selecione = this.navParams.get('selecione');;
    this.pacote = this.navParams.get('pacote');;
    this.arq_selecione = this.navParams.get('arq_selecione');;
    this.lang = this.navParams.get('lang');;
    console.log("a",this.package_imagens);
    this.getImagenServe();
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
 
  showConfirm_ItemArray(id_img) {
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
           this.removeItemArray(id_img);
         }
       }
     ]
   });
   confirm.present();
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
  reorderItem(indexes){
    console.log("index",indexes);
    this.images   = reorderArray(this.images,indexes);
   console.log(this.images);
    
   }
  removeItemArray(item){
    console.log("item para remover",item);
    const index = this.images.indexOf(item);
    this.images.splice(index, 1);
    console.log( this.images );
  }
 validaPacote(){
  if(this.images.length > 0){
    console.log("entrei aqui no >0");
    if(this.images.length >= this.package_imagens ){
      const alert = this.alertCtrl.create({
        title: this.aviso,
        subTitle: this.msg_image+'<br>'+this.pacote+this.package_name+'<br>'+this.image_name +'CODE: '+this.package_imagens,
        buttons: ['OK']
      });
      alert.present();
    }else{
      console.log("entrei aqui no ==");
        this.onActionSheet();
    }
  }else {
    console.log("entrei aqui no else");
    this.onActionSheet();
 } 

}
  //chama pra escolher a opção da foto
onActionSheet(): void {
 
    this.actionSheetCtrl.create({
      title: this.selecione,
      buttons: [
        {
          text: this.galeria,
          handler: () => {
            
              this.getPictures(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: this.camera_btn,
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: this.btn_cancelar
        }
      ]
    }).present();
  
 
   
  
  
 
}  
private takePicture(sourceType: number): void {

  let cameraOptions    : CameraOptions = {
    correctOrientation: true,
    quality: 100,
    saveToPhotoAlbum: false,
    sourceType: sourceType,
    mediaType: this.camera.MediaType.PICTURE
        
  };
  this.camera.getPicture(cameraOptions)
    .then((fileUri: string) => {
              //converter base64
             this.util.converterBase64(fileUri).then((base64:any) => {
              base64.replace('', '+');
              console.log(base64);
              this.images.push({id: "",files:base64,img_link:fileUri,file_name: fileUri});
             });
          
          }).catch((err: Error) => console.log('Camera error: ', err));
  }
     

getPictures(sourceType: number){ 
  let qtd = this.package_imagens;
  let options = {
    maximumImagesCount: 5,
    quality: 100,
    sourceType: sourceType
  }
  this.imagePicker.getPictures(options).then( results =>{
    for(let i=0; i < results.length;i++){
      //console.log("result image picker",results[i]);
      if(results[i] != "K" && results[i] != "O"){
          //converter base64
          this.util.converterBase64(results[i]).then((base64:any) => {
            base64.replace('', '+');
            console.log(base64);
            this.images.push({id: "",files:base64,img_link:results[i],file_name: results[i]});
          });
      } 
    
    }
  });
 

}
closeModal() {
  this.navCtrl.pop();
 // this.navCtrl.push('ImageCodePage',{imagens:this.images,token:this.token,code:this.id_code,qtd:this.qtd,pacote:this.pacote});
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
                  //this.removeItemArray(id_img);
                  this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                 // this.imagesbase64="";
                 this.images =result.midias;
               /*    if(result.midias.length > 0){
                    this.imagesbase64 =result.midias;
                    this.getImagenServe();
                  }else{
                    
                   
                  }  */
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
 
enviar(){
if(this.images.length >0){
  console.log(this.images);
  this.util.showLoading(this.load_enviando);
    if(this.net.ckeckNetwork()){
        this.codeProvider.imagen_create(this.id_code,this.token,this.images,this.lang) 
        .subscribe(
          (result: any) =>{
            this.util.loading.dismiss(); 
            if(result.status == 200){
              this.images      = [];
              this.imagesbase64 = result.midias;
              this.getImagenServe();
              this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
              
              //this.navCtrl.pop();       
            //  this.navCtrl.push('ImageCodePage',{imagens:this.images,token:this.token,code:this.id_code,qtd:this.qtd,pacote:this.pacote});
            }else if(result.status == 402){
              this.navCtrl.push('LoginPage',{lang:this.lang});
            }
            else if(result.status == 403){
              this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
            }
        },(error:any) => {
          //console.log('erro',error);
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
        subTitle: this.arq_selecione,
        buttons: ['OK']
      });
      alert.present();
  }
}

}

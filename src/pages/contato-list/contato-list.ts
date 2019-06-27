import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ToastController, AlertController, ModalController, ViewController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { CodeProvider } from './../../providers/code/code';
import { UtilService } from '../../providers/util/util.service';
import { TranslateService } from '@ngx-translate/core';


@IonicPage({
  priority : 'low',
  segment  : 'ContatoList/:token/:code_id/:lang',
  defaultHistory:['MeusCodesPage']
})
@Component({
  selector: 'page-contato-list',
  templateUrl: 'contato-list.html',
})
export class ContatoListPage {
  @ViewChild('mySlider') slider: Slides;
  selectedSegment      : string;
  slides               : any; 
  token        : String;
  code_id      : String; 
  facebook     : any[];
  instagram    : any[];
  whatsapp     : any[];
  fone         : any[];
  email        : any[];
  linkedin     : any[];
  site         : any[];  
  selectTipo   : String;         
  page;
  btn_publicar;
  btn_cancelar;
  btn_excluir;
  load_aguarde;
  load_enviando;
  departamento;
		pais ;
		contato;
		email_campo;
    campo_link;
    lang;
    msg_servidor;
    msg_exlcuir;
    texto;
    page_contato;
  constructor( public navCtrl         : NavController, 
               public navParams       : NavParams,
               public alertCtrl       : AlertController,
               private codeProvider   : CodeProvider,
               public  net            : NetworkProvider,
               public toast           : ToastController,
               public util            : UtilService,
               public viewCtrl        : ViewController,
               public modalCtrl       : ModalController,
               private translate 	  : TranslateService
               ) {
    this.selectedSegment = '0';
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContatoListPage');
    this.token         = this.navParams.get('token');
    this.code_id       = this.navParams.get('code_id');
    this.lang          = this.navParams.get('lang');
    this.selectTipo    = "";
    this.facebook      = [];
    this.instagram     = [];
    this.whatsapp      = [];
    this.fone          = [];
    this.email         = [];
    this.linkedin      = [];
    this.site          = [];   
    this.selectTipo    = "whatsapp";
    this._translateLanguage();
  
    }
    private ionViewDidEnter() {
        
      this.getList();
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
          this.page             = this.translate.instant("meus_contatos.page");
          this.btn_cancelar     = this.translate.instant("default.btn_cancelar");
          this.msg_servidor     = this.translate.instant("default.msg_servidor");
          this.texto            = this.translate.instant("meus_contatos.texto");
          this.load_enviando    = this.translate.instant("default.load_enviando");
          this.load_aguarde     = this.translate.instant("default.load_aguarde");
          this.load_enviando    = this.translate.instant("default.load_enviando");
          this.msg_exlcuir      = this.translate.instant("default.msg_exlcuir");
          this.btn_publicar     = this.translate.instant("default.btn_publicar");
          this.btn_excluir     = this.translate.instant("default.btn_excluir");
          this.departamento     = this.translate.instant("meus_contatos.departamento");
          this.pais             = this.translate.instant("meus_contatos.pais");
          this.contato          = this.translate.instant("meus_contatos.contato");
          this.email_campo      = this.translate.instant("meus_contatos.email");
          this.campo_link       = this.translate.instant("meus_contatos.campo_link");
          this.page_contato       = this.translate.instant("meus_contatos.page");
        
        
       }, 250);
    }
//trocar o slide de acordo com o segment
onSegmentChanged(segmentButton) {
  const selectedIndex = segmentButton.value;
  this.slider.slideTo(selectedIndex);
 }
//trocar a o segment de acordo com o slide
onSlideChanged(slider) {
  const currentSlide = slider.getActiveIndex();
  if(currentSlide == 0){
    this.selectedSegment = '0';
    this.selectTipo = "whatsapp";
  }else if(currentSlide == 1){
      this.selectedSegment = '1';
      this.selectTipo = "telefone";
  }else if(currentSlide == 2){
    this.selectedSegment = '2';
    this.selectTipo = "email";
  }
  else if(currentSlide == 3){
    this.selectedSegment = '3';
    this.selectTipo = "site";
  }
  else if(currentSlide == 4){
    this.selectedSegment = '4';
    this.selectTipo = "facebook";
  }
  else if(currentSlide == 5){
    this.selectedSegment = '5';
    this.selectTipo = "instagram";
  }else if(currentSlide == 6){
    this.selectedSegment = '6';
    this.selectTipo = "linkedin";
  }
  console.log(this.selectTipo);
}
voltar(){
  this.viewCtrl.dismiss();
}
 getList(){
  this.util.showLoading(this.load_aguarde);
  if(this.net.ckeckNetwork()){
     this.codeProvider.contato(this.code_id,this.token,"true","","","","","","get","",this.lang).subscribe(
      (result: any) =>{    
      this.util.loading.dismiss(); 
            if(result.status == 200){
                  this.whatsapp  = result.code_sectors.whatsapp;
                  this.facebook  = result.code_sectors.facebook;
                  this.instagram = result.code_sectors.instagram;
                  this.fone      = result.code_sectors.telefone;
                  this.email     = result.code_sectors.email;
                  this.linkedin  = result.code_sectors.linkedin;
                  this.site      = result.code_sectors.site;
                  console.log(this.whatsapp,this.facebook,this.instagram,this.fone);
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
 newSetor(id){
  let myModal =this.modalCtrl.create('ContatoAddPage',{load_aguarde:this.load_aguarde,load_enviando:this.load_enviando,lang:this.lang,token:this.token,code_id:this.code_id ,setor_id:id,tipo:this.selectTipo,btn_publicar:this.btn_publicar,pais:this.pais,departamento:this.departamento,email_campo:this.email_campo,contato:this.contato,page:this.contato,campo_link:this.campo_link});
  myModal.present();
  //this.viewCtrl.dismiss();
  //this.navCtrl.push('ContatoAddPage', {token:this.token,code_id:this.code_id ,setor_id:id,tipo:this.selectTipo});
 }
 closeModal() {
  this.navCtrl.pop();
}
  //chamada alerta de confirmação antes de excluir
  showConfirm(id_code,tipo) {
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
           this.deleteSetor(id_code,tipo);
         }
       }
     ]
   });
   confirm.present();
  
  
  } 
 deleteSetor(id,tipo){
  this.util.showLoading(this.load_aguarde);
      if(this.net.ckeckNetwork()){
        this.codeProvider.contato(this.code_id,this.token,"true","","","","","","delete",id,this.lang).subscribe(
        (result: any) =>{    
        this.util.loading.dismiss(); 
              if(result.status == 200){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                this.removeItemArray(id,tipo);
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
 removeItemArray(item,tipo){
  console.log("item para remover",item,tipo);
   
  if(tipo == 0){
     const index = this.whatsapp.indexOf(item);
      this.whatsapp.splice(index, 1);
      console.log("entrei",item,tipo);
  }else if(tipo == 1){
    const index = this.fone.indexOf(item);
    this.fone.splice(index, 1);
    console.log("entrei",item,tipo);
  }else if(tipo == 2){
    const index = this.email.indexOf(item);
    this.email.splice(index, 1);
    console.log("entrei",item,tipo);
  }
  else if(tipo == 3){
    const index = this.site.indexOf(item);
    this.site.splice(index, 1);
    console.log("entrei",item,tipo);
  }
  else if(tipo == 4){
    const index = this.facebook.indexOf(item);
    this.facebook.splice(index, 1);
    console.log("entrei",item,tipo);
  }
  else if(tipo == 5){
    const index = this.instagram.indexOf(item);
    this.instagram.splice(index, 1);
    console.log("entrei",item,tipo);
  }else if(tipo == 6){
    const index = this.linkedin.indexOf(item);
    this.linkedin.splice(index, 1);
    console.log("entrei",item,tipo);
  }
}

}

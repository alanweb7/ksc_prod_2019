import { Component } from '@angular/core';
import { IonicPage, NavController, Navbar ,NavParams,AlertController,PopoverController ,  LoadingController, ToastController,  ViewController, Events, Popover } from 'ionic-angular';
import { CodeProvider } from './../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
import { ViewChild } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { PopoverComponent } from '../../components/popover/popover';
@IonicPage({
  priority : 'high',
  segment  : 'MeusCodes/:token/:lang',
  defaultHistory:['HomePage']
})
@Component({
  selector: 'page-meus-codes',
  templateUrl: 'meus-codes.html',
})
export class MeusCodesPage {
  @ViewChild(Navbar) navBar: Navbar;
  endLat             : any;
  endLong            : any;
  meus_codes       : any[];
  token            : any;
  codes            : any;
  codes_videos     : any;
  code_expiratiion : any;
  package_name     : any;
  package_imagens  : any;
  package_videos   : String;
  codes_serve      : any[];
  searchTerm       : string = '';
  searchControl    : FormControl;
  ask_id           : String;
  page;
  msg_exlcuir;
  btn_cancelar;
  btn_excluir;
  msg_erro    ;
  excluir_msg ;
  btn_salvar ;
  campo ;
  pacote ;
  videos;
  vencimento
  dias;
  lang ;
  info;
  msg_pacote;
  texto;
  load_aguarde;
  load_enviando;
  msg_servidor;
  code_existe: any;
  language: any;
  selecione: any;
  visite_code: any;
  popover : Popover;
  constructor(
              public navCtrl       : NavController,
              public navParams     : NavParams,
              public alertCtrl     : AlertController,
              private codeProvider : CodeProvider,
              public toast         : ToastController,
              public  net          : NetworkProvider,
              public viewCtrl      : ViewController,
              public loadingCtrl   : LoadingController,
              public util          : UtilService,
              private geoProv      : GeolocationProvider,
              public popoverCtrl   : PopoverController,
              private event        : Events,
              private translate 	 : TranslateService
             ) {
              this.searchControl   = new FormControl();

              this.event.subscribe("update_popover",(lang:any)=>{
               //this.getAllCode(this.token);
               // this.codes_serve=[];
               // this.meus_codes=[];
               this.removeItemArray(lang);
                console.log(lang);
               // this.popover.dismiss();
              });
  }

ionViewDidLoad() {
    this.token        = String;
    this.token        = "";
    this.token        = this.navParams.get('token');
    this.lang         = this.navParams.get('lang');
    this.meus_codes   = [];
    this.codes_serve  = [];
    this._translateLanguage();
  
    if(this.net.ckeckNetwork()){
     
        this.util.showLoading(this.load_aguarde);
        this.getAllCode(this.token);
        this.setFilteredItems();
        this.pushGeoinfo();
    }else{
     
    
      this.navCtrl.setRoot('NotNetworkPage');
    } 
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.setRoot('HomePage');
     
     }  
   
}
removeItemArray(item){
  console.log("item para remover",item);
  const index = this.meus_codes.indexOf(item);
  console.log(index);
  this.meus_codes.splice(index, 1);
  console.log( this.meus_codes );
  this.popover.dismiss();
}
private _translateLanguage() : void
{
   this.translate.use(this.lang);
   this._initialiseTranslation();
}
private _initialiseTranslation() : void
{
   setTimeout(() =>
   {
      this.page           = this.translate.instant("meus_codes.page");
      this.btn_cancelar   = this.translate.instant("default.btn_cancelar");
      this.btn_salvar     = this.translate.instant("default.btn_salvar");
      this.btn_excluir    = this.translate.instant("default.btn_excluir");
      this.msg_exlcuir    = this.translate.instant("default.msg_exlcuir");
      this.msg_erro       = this.translate.instant("default.msg_erro");
      this.excluir_msg    = this.translate.instant("default.excluir_msg");
      this.campo          = this.translate.instant("meus_codes.campo");
      this.msg_pacote     = this.translate.instant("default.msg_pacote");
      this.vencimento     = this.translate.instant("default.vencimento");
      this.pacote         = this.translate.instant("default.pacote");
      this.videos         = this.translate.instant("default.videos");
      this.dias           = this.translate.instant("default.dias");
      this.info           = this.translate.instant("default.info");
      this.msg_servidor   = this.translate.instant("default.msg_servidor");
      this.texto          = this.translate.instant("criar_code.texto");
      this.campo          = this.translate.instant("criar_code.campo");
      this.load_enviando  = this.translate.instant("default.load_enviando");
      this.load_aguarde   = this.translate.instant("default.load_aguarde");
      this.msg_erro       = this.translate.instant("default.msg_erro");
      this.selecione      = this.translate.instant("videos.selecione");
      this.code_existe    = this.translate.instant("home.code_existe");
      this.visite_code    = this.translate.instant("default.visite_code");
   }, 250);
}
onCancel(){
    return this.meus_codes =this.codes_serve;
  
}
filterItems(searchTerm){
    return this.meus_codes.filter((item) => {
        return item.code.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });     

}
setFilteredItems() {
   if(this.searchTerm == ""){
      this.meus_codes=[];
      this.onCancel();
   }else{
    this.meus_codes = this.filterItems(this.searchTerm);
   }
 

}
showAlert() {
    const alert = this.alertCtrl.create({
      title: this.info,
      subTitle: this.pacote+":"+this.package_name+'<br>'+this.codes+' CODES<br>'+this.codes_videos+" "+this.videos+' CODE<br>'+this.vencimento+":"+this.code_expiratiion+' '+this.dias,
      buttons: ['OK']
    });
    alert.present();
}

showEnquete(code){
    this.navCtrl.push('EnqueteListPage', {token:this.token,code:code,ask_id:this.ask_id});
}
getAllCode(token){
    if(this.net.ckeckNetwork()){
    this.codeProvider.getAllCode(token)
    .subscribe(
          (result: any) =>{
              this.util.loading.dismiss(); 
              if(result.status == 200){
                    for (var i = 0; i < result.codes.length; i++) {
                          var nov = result.codes[i];
                           if(nov.descricao != "" && nov.descricao != null){
                            nov.descricao = " - " +nov.descricao.substring(0,50)+'...';
                          } 
                          this.codes_serve.push(nov);
                         
                      }
                      this.codes            = result.info_user.package_code.package_codes;
                      this.codes_videos     = result.info_user.package_code.package_videos;
                      this.code_expiratiion = result.info_user.package_code.package_days;
                      this.package_name     = result.info_user.package_code.package_name;
                      this.package_imagens  = result.info_user.package_code.package_imagens;
                      console.log("img2",this.package_imagens);
                   
              }else if(result.status == 402){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                this.navCtrl.push('LoginPage',{lang:this.lang});
              }
              else if(result.status == 403){
                this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                this.navCtrl.push('HomePage');
              }
             
              
            
          } ,(error:any) => {
            this.toast.create({ message:this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
              this.util.loading.dismiss(); 
             
          });
        } else{
          this.util.loading.dismiss();
          this.navCtrl.setRoot('NotNetworkPage');
     }
  }
 

presentPopover(myEvent,code_id,codeNumber,card,slug) {
  console.log(code_id,codeNumber);
  //this.token        = this.navParams.get('token');
  this.popover = this.popoverCtrl.create(PopoverComponent,{origem:2,btn_cancelar:this.btn_cancelar,btn_excluir:this.btn_excluir,msg_exlcuir:this.msg_exlcuir,package_name:this.package_name,package_imagens:this.package_imagens,package_videos:this.codes_videos,load_aguarde:this.load_aguarde,excluir_msg:this.excluir_msg,msg_servidor:this.msg_servidor,token:this.token,code_id:code_id,visite_code:this.visite_code,card:card,lang:this.lang,slug:slug,codeNumber:codeNumber});
  this.popover.present({
    ev: myEvent
  });
}

validaPacote(){
  console.log();
 // this.meus_codes.length = 100;
  if(this.meus_codes.length > 0){
    if(this.meus_codes.length >= this.codes ){
      const alert = this.alertCtrl.create({
        title: 'Alerta',
         subTitle: this.msg_pacote+"<br>"+this.pacote+":"+this.package_name+'<br>'+this.codes+' CODES<br>'+this.codes_videos+" "+this.videos+' CODE<br>'+this.vencimento+":"+this.code_expiratiion+' '+this.dias,
  
        buttons: ['OK']
      });
      alert.present();
    }else{
        this.showPrompt();
    }
  }else {
    this.showPrompt();
 } 

}
showPrompt() {
     const prompt = this.alertCtrl.create({
        title: this.texto,
        enableBackdropDismiss: false ,
        inputs: [
          {
            name: 'code',
            placeholder: this.campo
          },
        ],
        buttons: [
          {
            text: this.btn_cancelar,
            handler: data => {
              
            }
          },
          {
            text: this.btn_salvar,
            handler: data => {
              this.code_create(data.code,data.link);
            }
          }
        ]
      });
      prompt.present();
  
}

code_create(name_code,link){
    if(this.net.ckeckNetwork()){
          this.util.showLoading(this.load_aguarde);
          let t_conteudo = "1";
          if(link != "" && link != null){
                t_conteudo = "2";
          }
         this.codeProvider.code_create(this.token,name_code,link,t_conteudo,this.lang)
          .subscribe(
                (result: any) =>{
                  this.util.loading.dismiss(); 
                  if(result.status == 200){
                  
                    this.toast.create({ message: result.message, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                    this.navCtrl.push('MenuCodePage', {token:this.token,code:result.IDentrada,qtd_img:this.package_imagens,qtd_videos:this.codes_videos,pacote:this.package_name});
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

  //captura a localização via provider
  pushGeoinfo(){
   
    this.geoProv.getGeolocation().then((resp:String[])=>{
      console.log('home',resp);
    
      this.endLat = resp["latitude"];
      this.endLong = resp["longitude"];
        console.log('home',this.endLat,this.endLong );
     });
 } 

}

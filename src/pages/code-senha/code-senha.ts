import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { CodeProvider } from './../../providers/code/code';
import { FormBuilder, Validators } from '@angular/forms';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
import { BrowserTab } from '@ionic-native/browser-tab';
import { TranslateService } from '@ngx-translate/core';
@IonicPage({
  priority : 'off',
  segment  : 'CodeSenha/:info/:id_code/:link/:origem/:token/:lang',
  defaultHistory:['HomePage'],
  
})
@Component({
  selector: 'page-code-senha',
  templateUrl: 'code-senha.html',
})
export class CodeSenhaPage {
  model            : Login;
  errorPassword    = false;
  messagePassword  = "";
  id_code          : Number;
  info             : String;
  link             : String;
  token            : String;
  public type      = 'password';
  public showPass  = false;
  origem           :Number;
  //validação de formulario
  public loginForm : any;
  page: any;
  senha: any;
  btn_entrar: any;
  btn_cancelar: any;
  campo_obrigatorio: any;
  load_enviando: any;
  msg_servidor: any;
  lang: any;
  telephone: any;
  latitude: any;
  longitude: any;
  isLiberado: any;
  code: any;
  constructor(
          public navCtrl        : NavController,
           public navParams     : NavParams     ,
           private codeProvider : CodeProvider,
           formBuilder          : FormBuilder,
           public  util         : UtilService,
           public toast         : ToastController,
           public  net          : NetworkProvider,
           public viewCtrl      : ViewController,
           private browserTab   : BrowserTab,
           private translate 	  : TranslateService
          ) {
           //instanica do model login
           this.model = new Login();
           //instancia do formulario builder para validar os campos
           this.loginForm = formBuilder.group({
          
             password : ['', Validators.required]});
  }

  ionViewDidLoad() {
    this.id_code      = this.navParams.get('id_code');
     this.link         = this.navParams.get('link');
    this.token        = this.navParams.get('token');
    this.origem       = this.navParams.get('origem');
    this.lang         = this.navParams.get('lang');
    this.code        = this.navParams.get('code');
   
    this.telephone        = this.navParams.get('telephone');
    this.latitude        = this.navParams.get('latitude');
    this.longitude        = this.navParams.get('longitude');
    this.isLiberado  = this.navParams.get('liberado');
    this.origem      = this.navParams.get('origem');
    this.token       = this.navParams.get('token');
    this.lang        = this.navParams.get('lang');
    console.log(this.origem);
    this._translateLanguage();
    
    
  }
  ionViewWillUnload() {
    this.navCtrl.setRoot('HomePage');
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
        this.page             = this.translate.instant("meus_codes.code_privado");
        this.btn_cancelar     = this.translate.instant("default.btn_cancelar");
        this.msg_servidor     = this.translate.instant("default.msg_servidor");
        this.senha            = this.translate.instant("login.senha");
        this.btn_entrar       = this.translate.instant("login.page");
        this.btn_cancelar     = this.translate.instant("default.btn_cancelar");
        this.btn_cancelar     = this.translate.instant("default.btn_cancelar");
        this.load_enviando = this.translate.instant("default.load_enviando");
      
     }, 250);
  }
  showPassword() {
    this.showPass = !this.showPass;
  
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  login() {
    
    let {  password } = this.loginForm.controls;
    
    if (!this.loginForm.valid) {
              if (!password.valid) {
                this.errorPassword = true;
                this.messagePassword =this.campo_obrigatorio
              } else {
                this.messagePassword = "";
              }
    }
    else {

        this.util.showLoading(this.load_enviando);
          if(this.net.ckeckNetwork()){
            
                this.codeProvider.getCodePassword(this.model.password,this.id_code,this.lang) 
                 .subscribe(
                    (result: any) =>{    
                      this.util.loading.dismiss(); 
                      if(result.status == 200){
                        if(this.link == null){
                          this.toast.create({ message: result.messagem, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                       //  this.viewCtrl.dismiss();
                          this.navCtrl.push('DetalheCodePage', {origem:1,lang:this.lang,
                           liberado:true, code: this.code,latitude:this.latitude,longitude:this.longitude,telephone:this.telephone
                             
                          });
                        
                        }else{
                          this.toast.create({ message: result.messagem, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                        // this.viewCtrl.dismiss();
                          this.navCtrl.push('DetalheCodePage', {origem:1,lang:this.lang,
                           liberado:true, code: this.code,latitude:this.latitude,longitude:this.longitude,telephone:this.telephone
                          });
                         
                        }
                       
                      }
                      else if(result.status == 403){
                        this.toast.create({ message:result.messagem, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                        
                      }
      
                 } ,(error:any) => {
                  this.toast.create({ message:this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                  this.util.loading.dismiss(); 
                  this.navCtrl.setRoot('HomePage');
                 });
      
          }else{
            this.util.loading.dismiss(); 
              this.navCtrl.setRoot('NotNetworkPage',{lang:this.lang});
          } 
       
        }
  }
  voltar(){
    if(this.origem == 1){
      this.navCtrl.setRoot('HomePage');
    }else if(this.origem == 2){
      this.navCtrl.setRoot('MeusCodesPage',{token:this.token});
    }else if(this.origem == 3){
      this.navCtrl.setRoot('HistoricoPage',{token:this.token});
    }else{
      this.navCtrl.setRoot('HomePage');
    }
  
    
  }
  openWithInAppBrowser(url){
    this.browserTab.isAvailable()
    .then(isAvailable => {
      if (isAvailable) {
        this.browserTab.openUrl(url);
      } 
    });
  }

}
export class Login{
  password  : String;
}
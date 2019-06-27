import { Component } from '@angular/core';
import { NavController,IonicPage, NavParams, Platform, LoadingController,Events, AlertController, ModalController, MenuController } from 'ionic-angular';
//Import Native
import { OneSignal } from '@ionic-native/onesignal'; 
import { Deeplinks } from '@ionic-native/deeplinks';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BrowserTab } from '@ionic-native/browser-tab';
//import Provider
import { CodeProvider } from '../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';
import { UsuarioService } from '../../providers/movie/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Keyboard } from '@ionic-native/keyboard';
import { TranslateService } from '@ngx-translate/core';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { SqliteHelperService } from '../../providers/sqlite-helper/sqlite-helper.service';
import { ClienteProvider } from '../../providers/cliente/cliente';
@IonicPage({
  priority : 'high'
})@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  
  codeNumber         : any;
  endLat             : any;
  endLong            : any;
  myfone             : any;
  movies             : Usuario[] = [];
  token              : any;
  id                 : any ; 
  id_serv            : Number;
  footerIsHidden     : Boolean = true;
  public myGlobalVar : string;
  public title : string;
  public description : string;
  public language : string ="pt";
  button:String ="";
  pesquisa:String="";
  adquira:String="";
  data = {
    id_serv     :Number,
    name        :String,
    sobrenome   :String,
    email       :String,
    photo       :String,
    logado      :String,
    token       :String,
    usuario     :String,
    lang        :String,
    cnpj        :String,
    tp_pessoa   :String
   
}
trans={
  login 		: String,
  home      : String,
  favoritos : String,
  pesquisa  : String,
  codes     : String,
  sair      : String,
  page_pesquisa :String,
  msg_servidor:String,
  load_aguarde:String,
  nome:String,
  sobrenome:String,
    email:String,
    empresa:String,
    segmento:String,
    cep:String,
    cidade:String,
    estado:String,
    page:String,
    btn_salvar:String,
    page_login: String,
    load_enviando: String,
    campo_obrigatorio: String,
    frase: String,
    senha: String,
    esqueceu: String,
    ou: String,
    conta: String,
    page_senha: String,
    texto_1: String,
    texto_2: String,
    usuario:String,
    page_conta:String
}
  campo;
  load_aguarde: any;
  msg_erro: any;
  selecione: any;
  btn_cancelar: any;
  btn_continuar: any;
  code_existe: any;
  btn_ircode: any;
  btn_fechar: any;
  page_pesquisa: any;
  page_consulta:any;
  msg_servidor: any;
  isPT:boolean = false;
  isDE:boolean = false;
  isEN:boolean = false;
  isES:boolean = false;
  isFR:boolean = false;
  isIT:boolean = false;
  page_login: any;
  load_enviando: any;
  campo_obrigatorio: any;
  frase: any;
  page: any;
  senha: any;
  esqueceu: any;
  ou: any;
  conta: any;
  page_senha: any;
  texto_1: any;
  texto_2: any;
  email ;
  texto: any;
  msg_code: any;
  constructor(
    public loadingCtrl     : LoadingController,
    public navCtrl         : NavController,
    public navParams       : NavParams,
    private global         : CodeProvider,
    private geoProv        : GeolocationProvider,
    private platform       : Platform,
    private events         : Events,
    private socialSharing  : SocialSharing,
    private browserTab     : BrowserTab,
    private oneSignal      : OneSignal, 
    public alertCtrl       : AlertController,
    public  net            : NetworkProvider,
    private deeplinks      : Deeplinks,
    private usuario        : UsuarioService,
    private cli_Provider    : ClienteProvider ,
    private keyboard       : Keyboard,
    public modalCtrl       : ModalController,
    public menu             : MenuController,
    public sqliteHelperService: SqliteHelperService,
    private translate 	  : TranslateService
    
  ) {
     
    if (this.platform.is('ios')){
      this.sqliteHelperService.getDb()
      .then((movies:any) => {
          //alert("alert deu certo");
      }).catch((erro)=>{
         // alert("deu errado"+erro);
      });
     }
      
    }
   
  
    ionViewDidLoad(){
     
     // this._initialiseTranslation();
      if(this.net.ckeckNetwork()){
        //CHAMDA DO BANCO DE DADOS
                  this.usuario.getAll()
                      .then((movies:any) => {
                        console.log(movies);
                        if(movies.length == 1){
                             this.data.name       = movies[0].name;
                              this.data.sobrenome = movies[0].sobrenome;
                              this.data.email     = movies[0].email;
                              this.data.token     = movies[0].token;
                              this.token          = movies[0].token;
                              this.data.logado    = movies[0].logado;
                              this.data.id_serv   = movies[0].id_serv;
                              this.data.photo     = movies[0].photo;
                              this.data.usuario   = movies[0].usuario;
                              this.data.lang      = movies[0].cpf;
                              this.language       = movies[0].cpf;
                              this.id_serv        = movies[0].id_serv;
                              this.data.cnpj      = movies[0].cnpj;
                              this.data.tp_pessoa = movies[0].tp_pessoa;
                              
                              if(this.language ==  "" || this.language == undefined || this.language == null){
                                    this.language = "pt";
                              }
                              this.update_cupom();
                              this.trogle_idiome_onesignal();
                            //  this.events.publish('trans',this.language);         
                              this.events.publish('dados',this.data);
                              
                         }else{
                          this.language= "pt";
                          console.log("minha lang",this.language);
                          
                           console.log("entrei no else");
                           
                            /* this.usuario.update_lang(this.language,this.id_serv)
                           .then((data: any) => {
                                 console.log(data);
                                 
                           });  */
                             this.isPT  =  true;
                             this.trogle_idiome_onesignal();
                         }
                        // this.language= "pt";
                        // this.isPT  =  true;
                         this.pushGeoinfo();
                         this.trogle_idiome(this.language);
                         this._translateLanguage();
                         this.oneSignalApp();
                      
          }).catch((error)=>{
                alert("sqlite Erro "+error);
                this.language= "pt";
                this.isPT  =  true;
                this.pushGeoinfo();
                this.trogle_idiome(this.language);
                this._translateLanguage();
                this.oneSignalApp();
          });
        
      }else{
                           
       
        this.navCtrl.setRoot('NotNetworkPage');
             
      }
      this.keyboard.onKeyboardShow().subscribe(() => {
          this.footerIsHidden= false;
      });
      this.keyboard.onKeyboardHide().subscribe(() => {
          this.footerIsHidden= true;
      });
      
     
    } 
    ionViewDidEnter() {
      //disabilita menu lateral
      this.menu.enable(true);
    
    } 
    update_cupom(){
      if(this.net.ckeckNetwork()){
        this.cli_Provider.getinfConta(this.token)
        .subscribe((result: any) =>{
        
          if(result.status == 200){
            this.usuario.update_cupom("",result.cupom_id,result.user_id)
            .then((data: any) => {
                  console.log("atualizei o cupom",data);
                   
            }); 
          }
        });
      }
     
    }
  trogle_idiome(id){
    console.log("lang",id);
      if(id=='pt'){
        this.isDE = false;
        this.isPT = true;
        this.isES = false;
        this.isFR = false;
        this.isEN = false;
        this.isIT = false;
      }else if(id=='de'){
          this.isDE = true;
          this.isPT = false;
          this.isES = false;
          this.isFR = false;
          this.isEN = false;
          this.isIT = false;
        }else if(id=='en'){
          this.isDE = false;
          this.isPT = false;
          this.isES = false;
          this.isFR = false;
          this.isEN = true;
          this.isIT = false;
      }else if(id=='it'){
        this.isDE = false;
        this.isPT = false;
        this.isES = false;
        this.isFR = false;
        this.isEN = false;
        this.isIT = true;
      }else if(id=='fr'){
        this.isDE = false;
        this.isPT = false;
        this.isES = false;
        this.isFR = true;
        this.isEN = false;
        this.isIT = false;
      }else if(id=='es'){
        this.isDE = false;
        this.isPT = false;
        this.isES = true;
        this.isFR = false;
        this.isEN = false;
        this.isIT = false;
      }else{
        this.isDE = false;
        this.isPT = true;
        this.isES = false;
        this.isFR = false;
        this.isEN = false;
        this.isIT = false;
      }
  }
  pushPage(){

     
     let latitude = this.endLat;
    let longitude = this.endLong;
    console.log('home codes com gps');
    this.navCtrl.push('DetalheCodePage', {liberado :false,origem:1,token:this.token,lang:this.language,
        code: this.codeNumber,
        latitude: latitude, longitude: longitude,
        telephone: this.global.myGlobalVar
    });

  }

pushGeoinfo(){
  this.platform.ready().then(() => {
    this.geoProv.getGeolocation().then((resp:String[])=>{
      console.log('home',resp);
    
        this.endLat = resp["latitude"];
        this.endLong = resp["longitude"];
        console.log('home',this.endLat,this.endLong );
     });
  });
} 
pushPageCode(){
  this.navCtrl.push('DetalheCodePage', {liberado :false,origem:1,token:this.token,lang:this.language,  code: 'KSCODE',
  latitude: this.endLat, longitude: this.endLong,
  telephone: this.global.myGlobalVar
  });
}

pushPagePesquisa(){

  let myModal =this.modalCtrl.create('CodePesquisaPage',{title:this.title,texto:this.texto,campo:this.campo,page_pesquisa:this.page_consulta,msg_servidor:this.msg_servidor,load_aguarde:this.load_aguarde,token:this.token,lang:this.language});
  myModal.present();
}
showCheckbox() {
 
  let alert = this.alertCtrl.create();
  alert.setTitle(this.selecione);
 //ingles, espanhol, italiano, frances e alemão
  alert.addInput({
    type: 'radio',
    label:"Português",
    value: "pt",
    checked: this.isPT
  });
  alert.addInput({
    type: 'radio',
    label:"Inglês",
    value: "en",
    checked: this.isEN
  });
  alert.addInput({
    type: 'radio',
    label:"Espanhol",
    value: "es",
    checked: this.isES
  });
  alert.addInput({
    type: 'radio',
    label:"Italiano",
    value: "it",
    checked: this.isIT
  });
  alert.addInput({
    type: 'radio',
    label:"Frânces",
    value: "fr",
    checked: this.isFR
  });
  alert.addInput({
    type: 'radio',
    label:"Alemão",
    value: "de",
    checked: this.isDE
  });
   alert.addButton(this.btn_cancelar);
   alert.addButton({
     text: this.btn_continuar,
     handler: data => {
       console.log('radio data:', data);
          this.language = data;
          this.usuario.update_lang(this.language,this.id_serv)
          .then((data: any) => {
                console.log(data);
                 
          }); 
          this.trogle_idiome(this.language);
          this.changeLanguage();
      
    
     }
   });
   alert.present();
}
// compartilhar social share
shareSheetShare() {
  this.socialSharing.share("KSCODE - Tudo se conecta aqui! ->", "Share subject", "", "https://play.google.com/store/apps/details?id=com.kcode360.kcode").then(() => {
  
  }).catch(() => {});
}

shopcode() {
  var url = 'https://kscode.com.br/pacotes/';
   this.browserTab.isAvailable()
    .then(isAvailable => {
      if (isAvailable) {
        this.browserTab.openUrl(url);
      } 
    });
}
// push notification onesignal
 oneSignalApp(){
   console.log(this.btn_fechar,this.btn_ircode);
  this.oneSignal.startInit('d9687a3a-3df5-4565-b183-653e84ed8207', '8700496258');
  this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
  this.oneSignal.handleNotificationReceived().subscribe( notification => {
    console.log(notification);
    //var notificationData       = notification.notification.payload;
   /*  var notificationAdditional = notificationData.additionalData;
    var notificationCode       = notificationAdditional.code; */
   // this.redirectPush(notification);
   const confirm              = this.alertCtrl.create({
    title: notification.payload.title,
    message: notification.payload.body,
    buttons: [
      {
        text: this.btn_fechar,
        handler: () => {
         
        }
      },
      {
        text: this.btn_ircode,
        handler: () => {
          this.redirectPush(notification.payload.additionalData.code);
        }
      }
    ]
  });
  confirm.present();
  });
  this.oneSignal.handleNotificationOpened().subscribe( notification => {
    var notificationData       = notification.notification.payload;
    var notificationAdditional = notificationData.additionalData;
    var notificationCode       = notificationAdditional.code;
    this.redirectPush(notificationCode);
  });
  
  this.oneSignal.endInit();
} 
public changeLanguage() : void
{
   this._translateLanguage();
}


private _translateLanguage() : void
{
   this.translate.use(this.language);
   this.trogle_idiome(this.language);
   console.log("linguagem",this.language);
   this._initialiseTranslation();
}
private _initialiseTranslation() : void
{
   setTimeout(() =>
   {
      this.title 			            = this.translate.instant("home.heading");
      this.button               	= this.translate.instant("home.button");
      this.pesquisa               = this.translate.instant("home.pesquisa");
      this.adquira              	= this.translate.instant("home.adquira");
      this.trans.login 			      = this.translate.instant("menu.login");
      this.trans.home         	  = this.translate.instant("menu.home");
      this.trans.favoritos        = this.translate.instant("menu.favoritos");
      this.trans.pesquisa         = this.translate.instant("menu.pesquisa");
      this.trans.codes           	= this.translate.instant("menu.codes");
      this.trans.sair           	= this.translate.instant("menu.sair");
      this.trans.page_pesquisa   	= this.translate.instant("default.page_pesquisa");
      this.trans.load_aguarde    	= this.translate.instant("default.load_aguarde");
      this.trans.msg_servidor    	= this.translate.instant("default.msg_servidor");
      this.trans.btn_salvar    	  = this.translate.instant("default.btn_salvar");
      this.trans.nome             = this.translate.instant("minha_conta.nome");
      this.trans.sobrenome        = this.translate.instant("minha_conta.sobrenome");
      this.trans.email            = this.translate.instant("minha_conta.email");
      this.trans.empresa          = this.translate.instant("minha_conta.empresa");
      this.trans.segmento         = this.translate.instant("minha_conta.segmento");
      this.trans.cep              = this.translate.instant("minha_conta.cep");
      this.trans.cidade           = this.translate.instant("minha_conta.cidade");
      this.trans.estado           = this.translate.instant("minha_conta.estado");
      this.trans.page_conta       = this.translate.instant("minha_conta.page");

      this.load_aguarde           = this.translate.instant("default.load_aguarde");
      this.msg_erro               = this.translate.instant("default.msg_erro");
       this.selecione             = this.translate.instant("videos.selecione");
      this.btn_cancelar           = this.translate.instant("default.btn_cancelar");
      this.btn_continuar          =this.translate.instant("default.btn_continuar");
      this.code_existe            =this.translate.instant("home.code_existe");
      this.btn_ircode             =this.translate.instant("default.btn_ircode");
      this.btn_fechar             =this.translate.instant("default.btn_fechar");
    
      console.log(this.btn_cancelar,this.btn_continuar,this.btn_fechar,this.btn_ircode);
      this.page_pesquisa          = this.translate.instant("default.page_pesquisa");
     // this.load_aguarde           = this.translate.instant("default.btn_fechar");
      this.msg_servidor           =  this.translate.instant("default.msg_servidor");
      this.page_consulta           =  this.translate.instant("default.page_pesquisa");
      this.campo           =  this.translate.instant("meus_codes.campo");
      this.texto           =  this.translate.instant("default.pesquisa");

      this.trans.page_login             = this.translate.instant("login.page");
      this.trans.load_enviando          = this.translate.instant("default.load_enviando");
      this.trans.campo_obrigatorio      = this.translate.instant("default.campo_obrigatorio");
      this.trans.frase                  = this.translate.instant("login.frase");   
      this.trans.page                   = this.translate.instant("login.page");  
      this.trans.usuario                = this.translate.instant("login.usuario");   
      this.trans.senha                  = this.translate.instant("login.senha");  
      this.trans.esqueceu               = this.translate.instant("login.esqueceu");  
      this.trans.ou                     = this.translate.instant("login.ou");  
      this.trans.conta                  = this.translate.instant("login.conta");  
      this.trans.page_senha             = this.translate.instant("recupera_senha.page");  
      this.trans.texto_1                = this.translate.instant("recupera_senha.texto_1");  
      this.trans.texto_2                = this.translate.instant("recupera_senha.texto_2");  
     // this.trans.email                  = this.translate.instant("recupera_senha.texto_2");  
      //this.trans.lang       = this.language;
     
     //this.events.publish('dados',this.data);
      this.events.publish('trans',this.trans);
      this.events.publish('lang',this.language);
    // this.events.publish('dados',this.data);
   }, 250);
 
}
// redirect push enter
redirectPush(notificationCode){
  console.log(notificationCode);
  
  this.navCtrl.push('DetalheCodePage', {liberado :false,origem:1,token:this.token,lang:this.language,
    code: notificationCode,
    latitude: this.endLat, longitude: this.endLong,
    telephone: this.global.myGlobalVar
  
  });
  console.log('notifcaca codes com gps');
 
 }

// redirect links
openDeeplinks(){
  this.deeplinks.routeWithNavController(this.navCtrl, {
    '/card': {'card':'DetalheCodePage',},
    '/about-us': {'card':'DetalheCodePage'},
  }).subscribe((match) => {
    console.log(match);
    var code = match.$link.queryString.substring(5,50); 
    if(code){
        this.redirectPush(code);
    }
  
  }, (nomatch) => {});
  
}
trogle_idiome_onesignal(){
  console.log("langsdfds",this.language);
    if(this.language =='pt'){
      this.btn_fechar           =  "Fechar";
      this.btn_ircode             = "Ir para Code";
      
    }else if(this.language =='de'){
          this.btn_fechar           =  "Schliessen";
          this.btn_ircode             = "Gehe zu CODE";
      }else if(this.language =='en'){
        this.btn_fechar           =  "Close";
        this.btn_ircode             = "Go to CODE"; 
    }else if(this.language =='it'){
      this.btn_fechar           =  "Vicino";
      this.btn_ircode             = "Vai al  CODE";
    }else if(this.language =='fr'){

      this.btn_fechar           =  "Proche";
      this.btn_ircode             = "Aller à CODE";
    }else if(this.language =='es'){
      this.btn_fechar           =  "Cerca";
      this.btn_ircode             = "Ir a CODE";
    }
}
}
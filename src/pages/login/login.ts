import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams , MenuController, ModalController,Events, ToastController, LoadingController} from 'ionic-angular';
import { BrowserTab } from '@ionic-native/browser-tab';

//import Provider
import { ClienteProvider } from './../../providers/cliente/cliente';
import { UsuarioService } from '../../providers/movie/usuario.service';
import { NetworkProvider } from '../../providers/network/network';
import { UtilService } from '../../providers/util/util.service';
//Import Model
import { Usuario } from './../../models/usuario.model';
import { TranslateService } from '@ngx-translate/core';
@IonicPage({
  priority : 'off',
  segment  : 'Login',
  defaultHistory:['HomePage']
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  [x: string]: any;
  model            : Login;
  //validação de formulario
  public loginForm : any;
  messageEmail     = "";
  messagePassword  = "";
  errorEmail       = false;
  errorPassword    = false;
  erro             = false;
  footerIsHidden     : Boolean = true;
  //tira a máscara
  word             =/[^0-9]+/g;
  public type      = 'password';
  public showPass  = false;
 
  data = {
     id_serv     :Number,
     name        :String,
     sobrenome   :String,
     email       :String,
     photo       :String,
     tp_pessoa   :String,
     cpf         :String,
     cnpj        :String,
     cep         :String,
     endereco    :String,
     numero      :String,
     complemento :String,
     bairro      :String,
     cidade      :String,
     estado      :String,
     telefone    :String,
     celular     :String,
     usuario     :String,
     logado      :String,
     token       :String
}
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
  pacote: any;
  image_name: any;
  dias: any;
  info: any;
  galeria: any;
  camera: any;
  msg_erro: any;
  msg_image: any;
  aviso: any;
  selecione: any;
  arq_selecione: any;
  lang: string;
  page_login: any;
  campo_obrigatorio: any;
  frase: any;
  senha: any;
  esqueceu: any;
  ou: any;
  conta: any;
  page_senha: any;
  texto_1: any;
  texto_2: any;
  email: string;
  endLat: any;
  endLong: any;
  page_consulta: any;
  constructor(public navCtrl        : NavController, 
      
            private translate 	  : TranslateService,
            public navParams        : NavParams,
            public menu             : MenuController,
            public  net             : NetworkProvider,
            private cli_Provider    : ClienteProvider ,
            private browserTab      : BrowserTab,
            private events          : Events,
            public toast            : ToastController,
            public modalCtrl        : ModalController,
            private usuario         : UsuarioService,
            public loadingCtrl      : LoadingController,
            public  util            : UtilService,
            formBuilder             : FormBuilder) {
            //instanica do model login
            this.model = new Login();
            //instancia do formulario builder para validar os campos
            this.loginForm = formBuilder.group({
              email    : ['', Validators.required],
              password : ['', Validators.required]});
             
  }

  ionViewDidLoad() {
    this.data.logado = String;
    this.lang          = this.navParams.get('lang');
    //inicia o banco de dados local
    this.usuario.getAll().then((movies:any) => {
      if(movies.length == 1){
        this.data.name     = movies[0].name;
        this.data.sobrenome= movies[0].sobrenome;
        this.data.email    = movies[0].email;
        this.data.token    = movies[0].token;
        this.data.logado   = movies[0].logado;
        this.data.id_serv  = movies[0].id_serv;
        //this.lang          = movies[0].cpf;

        this.data.photo    = movies[0].photo;
        this.data.usuario  = movies[0].usuario;
        
        this.events.publish('dados',this.data);
   }else{
       
       
        this.events.publish('dados',this.data);
   }
    });
    console.log(this.lang);
    this.trogle_idiome();
  }
  ionViewDidEnter() {
    //disabilita menu lateral
    this.menu.enable(false);
  
  }
  ionViewWillLeave() {
    // to enable menu.
    this.menu.enable(true);
   }
  login() {
    
    let { email, password } = this.loginForm.controls;
    
    if (!this.loginForm.valid) {
              if (!email.valid) {
                this.errorEmail = true;
                this.messageEmail = this.campo_obrigatorio;
              } else {
                this.messageEmail = "";
              }
          
              if (!password.valid) {
                this.errorPassword = true;
                this.messagePassword =this.campo_obrigatorio;
              } else {
                this.messagePassword = "";
              }
    }
    else {
       if(this.net.ckeckNetwork()){
                  let contextCliente: Usuario;
                  this.util.showLoading(this.load_enviando);
                  this.cli_Provider.login(this.model.email,this.model.password,this.lang)
                  .subscribe(
                        (result: any) =>{
                          console.log(result);
                          if(result.code == 403.001){
                                 this.util.loading.dismiss(); 
                                 this.toast.create({ message: result.message, position: 'top', duration: 10000,showCloseButton: true,closeButtonText: 'Ok!',cssClass: 'error' }).present();
                          
                            }else if(result.code == 403.002){
                                 this.util.loading.dismiss(); 
                                 this.toast.create({ message: result.message, position: 'top', duration: 10000,showCloseButton: true,closeButtonText: 'Ok!',cssClass: 'error' }).present();                              
                            }else{
                                     this.util.loading.dismiss(); 
                                     this.usuario.getById(result.data_user.id)
                                     .then((existe: Number) => {
                                 
                                       if (existe < 0) {
                                         contextCliente = new Usuario(result.data_user.id,result.data_user.first_name,result.data_user.last_name,result.user_email,result.data_user.avatar,"","","","","","","","","","","","","","1",result.token);
                                         this.usuario.create(contextCliente)
                                         .then((data: any) => {
                                               this.data.name     = result.data_user.first_name;
                                               this.data.sobrenome = result.data_user.last_name;
                                               this.data.email    = result.user_email;
                                               this.data.token    = result.token;
                                               this.data.usuario  = result.user_nicename;
                                               this.data.id_serv  = result.data_user.id;
                                               this.data.photo    = result.data_user.avatar;
                                               this.events.publish('dados',this.data);
                                               this.navCtrl.setRoot('HomePage'); 
                                               
                                         });
                                         
                                       }else{
                                         
                                         this.usuario.update(result.data_user.first_name,result.data_user.last_name,result.user_email,result.data_user.avatar,"","","1",result.token,result.data_user.id)
                                         .then((data: any) => {
                                                this.data.name      = result.data_user.first_name;
                                                this.data.sobrenome = result.data_user.last_name;
                                                this.data.email     = result.user_email;
                                                this.data.token     = result.token;
                                                this.data.usuario   = result.user_nicename;
                                                this.data.id_serv   = result.data_user.id;
                                                this.data.photo     = result.data_user.avatar;
                                                this.events.publish('dados',this.data);
                                                this.navCtrl.setRoot('HomePage');  
                                                
                                         });
                                         this.usuario.update_cupom(result.dados_cliente.cupom_code,result.dados_cliente.cupom_id,result.data_user.id).then((data: any) => {
                                                  console.log("update cupom",data);
                                         })
                               
                                     } 
                                  
                                     
                                    }); 

                           }
                          
                     },(error:any) => {
                      this.toast.create({ message:this.msg_servidor, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'error'  }).present();
                      this.util.loading.dismiss(); 
                      this.navCtrl.setRoot('HomePage');

                     });
                  
                    
                    
                          
                         
        }else{
          
            this.navCtrl.setRoot('NotNetworkPage');
              
        }

         
      }
    
}
recuperarsenhaModal() {
  let myModal = this.modalCtrl.create('RecuperasenhaPage',{lang:this.lang,campo_obrigatorio:this.campo_obrigatorio,page:this.page_senha,texto_1:this.texto_1,texto_2:this.texto_2,email:this.email});
  myModal.present();
}
voltar(){
  this.navCtrl.setRoot('HomePage');
              
}
pushPageCode(){
  this.navCtrl.push('DetalheCodePage', {liberado :false,origem:1,lang:this.lang,  code: 'KSCODE',
  latitude: this.endLat, longitude: this.endLong,
  telephone: ""
  });
}

pushPagePesquisa(){

  let myModal =this.modalCtrl.create('CodePesquisaPage',{page_pesquisa:this.page_consulta,msg_servidor:this.msg_servidor,load_aguarde:this.load_enviando,lang:this.lang});
  myModal.present();
}

showPassword() {
  this.showPass = !this.showPass;

  if(this.showPass){
    this.type = 'text';
  } else {
    this.type = 'password';
  }
}
  
//adquira seu code  
shopcode() {
    var url = 'https://kscode.com.br/pacotes/';
    this.browserTab.isAvailable()
    .then(isAvailable => {
      if (isAvailable) {
        this.browserTab.openUrl(url);
      } 
    }); 
  }
  trogle_idiome(){
    console.log("lang",this.lang);
      if(this.lang=='pt'){
        this.msg_servidor           =  "Não foi possível conectar ao servidor!";
        this.page_login             = "Entrar";
        this.load_enviando          = "Enviando...";
        this.campo_obrigatorio      = "Este campo é obrigatório.";
        this.frase                  = "Tudo se conecta aqui.";  
        this.email                  = "Seu usuário"; 
        this.senha                  = "Sua senha";  
        this.esqueceu               = "Esqueceu sua senha ?";  
        this.ou                     = "ou";  
        this.conta                  = "CRIAR MINHA CONTA";  
        this.page_senha             = "RECUPERAR SENHA";  
        this.texto_1                = "Digite seu email e depois vá em";  
        this.texto_2                = "siga os passos enviados ao seu email para criar uma nova senha."; 
        this.page_consulta          = "Pesquisa" ;
        this.adquira              	= "ADQUIRA SEU CODE";
        this.title 			            = "Tudo se conecta aqui!";

      }else if(this.lang=='de'){
          this.msg_servidor           =  "Verbindung zum Server konnte nicht hergestellt werden!";
          this.page_login             = "Eintreten";
          this.load_enviando          = "Senden ...";
          this.campo_obrigatorio      = "Dieses Feld ist erforderlich.";
          this.frase                  = "Hier verbindet sich alles";  
          this.email                  = "Benutzer"; 
          this.senha                  = "Passwort";  
          this.esqueceu               = "Passwort vergessen?";  
          this.ou                     = "oder";  
          this.conta                  = "Ein konto erstellen";  
          this.page_senha             = "PASSWORT ERHALTEN";  
          this.page_consulta          = "Suche" ;
          this.adquira              	= "hol deine CODE";

          this.title 			            = "hier verbindet sich alles!";


          this.texto_1                = "Geben Sie Ihre E-Mail-Adresse ein und gehen Sie zu";  
          this.texto_2                = "Folgen Sie den an Ihre E-Mail gesendeten Schritten, um ein neues Passwort zu erstellen.";  
        }else if(this.lang=='en'){
          this.msg_servidor           =  "Could not connect to server!";
          this.page_login             = "Log in";
          this.load_enviando          = "Sending ...";
          this.campo_obrigatorio      = "Dieses Feld ist erforderlich.";
          this.frase                  = "Everything connects here";  
          this.email                  = "user"; 
          this.senha                  = "password";  
          this.esqueceu               = "Forgot password?";  
          this.ou                     = "or";  
          this.conta                  = "Create an account";  
          this.page_senha             = "RECOVER PASSWORD";  
          this.texto_1                = "Enter your email and then go to";  
          this.page_consulta          = "Search" ;
          this.adquira              	= "get your CODE";
          this.title 			            = "everything connects here!";


          this.texto_2                = "follow the steps sent to your email to create a new password.";  
      }else if(this.lang=='it'){
        this.msg_servidor           =  "Impossibile connettersi al server!";
        this.page_login             = "Per entrare";
        this.load_enviando          = "invio...";
        this.campo_obrigatorio      = "Dieses Feld ist erforderlich.";
        this.frase                  = "Tutto si collega qui";  
        this.email                  = "utente"; 
        this.senha                  = "password";  
        this.esqueceu               = "Hai dimenticato la password?";  
        this.ou                     = "o";  
        this.conta                  = "Crea un account";  
        this.page_senha             = "RECUPERA PASSWORD";  
        this.texto_1                = "Inserisci la tua email e poi vai a";  
        this.page_consulta          = "ricerca" ;
        this.adquira              	= "PRENDI IL TUO CODE";
        this.title 			            = "tutto si collega qui";

        this.texto_2                = "segui i passaggi inviati alla tua email per creare una nuova password.";  
      }else if(this.lang=='fr'){
        this.page_consulta          = "Recherche" ;

        this.page_login             = "Entrer";
        this.campo_obrigatorio      = "Ce champ est obligatoire.";
        this.frase                  = "Tout se connecte ici";  
        this.email                  = "utilisateur"; 
        this.senha                  = "Mot de passe";  
        this.esqueceu               = "Mot de passe oublié?";  
        this.ou                     = "ou";  
        this.conta                  = "Créer un compte";  
        this.page_senha             = "RECUPERER MOT DE PASSE";  
        this.texto_1                = "Entrez votre email puis allez à";  
        this.texto_2                = "suivez les étapes envoyées à votre email pour créer un nouveau mot de passe.";  
        this.msg_servidor           =  "Impossible de se connecter au serveur!";
        this.load_enviando          = "Envoi...";
        this.adquira              	= "obtenir votre CODE";
        this.title 			            = "tout se connecte ici";
      }else if(this.lang=='es'){
        this.page_login             = "Eintreten";
        this.page_consulta          = "Búsqueda" ;

        this.campo_obrigatorio      = "Este campo es obligatorio.";
        this.frase                  = "Todo se conecta aquí";  
        this.email                  = "usuario"; 
        this.senha                  = "contraseña";  
        this.esqueceu               = "¿olvido la contraseña?";  
        this.ou                     = "o";  
        this.conta                  = "Crear una cuenta";  
        this.page_senha             = "RECUPERAR CONTRASEÑA";  
        this.texto_1                = "Introduzca su dirección de correo electrónico y, a continuación,";  
        this.texto_2                = "siga los pasos enviados a su correo electrónico para crear una nueva contraseña.";  
        this.msg_servidor           =  "No se pudo conectar al servidor!";
        this.load_enviando          = "Envío...";
        this.adquira              	= "todo se conecta aquí";

      }
  }
}

export class Login{
  email     :  String;
  password  : String;
  fcm_token : String;
}
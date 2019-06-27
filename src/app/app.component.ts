import { Component, ViewChild } from '@angular/core';
import { Events,Nav, Platform, ModalController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SqliteHelperService } from '../providers/sqlite-helper/sqlite-helper.service';
import { UsuarioService } from '../providers/movie/usuario.service';
import {Deeplinks} from "@ionic-native/deeplinks";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';
    mostra     : Boolean;
    id_serv     :Number;
    name        :String;
    sobrenome   :String;
    email       :String;
    photo       :String;
    tp_pessoa   :String;
    cpf         :String;
    cnpj        :String;
    cep         :String;
    endereco    :String;
    numero      :String;
    complemento :String;
    bairro      :String;
    cidade      :String;
    estado      :String;
    telefone    :String;
    celular     :String;
    usuario     :String;
    logado      :String;
    token       :String;
    login       :String;
    home        : String;
    codes       :String;
    favoritos   : String;
    pesquisa    :String;
    sair        :String;
    historico   :String;
    btn_cancelar:String;
    btn_excluir :String;
    excluir_msg : String;
    msg_erro    : String;
    msg_exlcuir : String;
    visite_code : String;
    public title : string;
    public description : string;
    public language : string;
    page_pesquisa : String;
    msg_servidor;
    load_aguarde;
    nome_mc:String;
    sobrenome_mc:String;
    email_mc:String;
    empresa:String;
    segmento:String;
    cep_mc:String;
    cidade_mc:String;
    estado_mc:String;
    page:String
    btn_salvar:String;
    //tradução login
    page_login: any;
    load_enviando: any;
    campo_obrigatorio: any;
    frase: any;
    senha: any;
    esqueceu: any;
    ou: any;
    conta: any;
    email_login:any;
   
    
  pages      : Array<{ color:string,icon: string, title: String, component: any}>;
  constructor(private usuarioService : UsuarioService,
              public platform        : Platform,
              private event          : Events,
              public statusBar       : StatusBar,
              public splashScreen    : SplashScreen,
              public modalCtrl       : ModalController,
              private usuarioDB        : UsuarioService,
              public sqliteHelperService: SqliteHelperService,
              deeplinks              : Deeplinks,
            //  public navCtrl: NavController,
             
              ) {
   
                this.initializeApp();
    deeplinks.routeWithNavController(this.nav, {
      '/card': {'card':'DetalheCodePage',},
      '/about-us': {'card':'DetalheCodePage'},
    }).subscribe((match) => {
      var code = match.$link.queryString.substring(5,50); 
      console.log("mene",match);
      if(code != "" && code != undefined ){
          this.redirectPush(code);
      }
      console.log('Successfully routed',match.$link.queryString.substring(4,50));
      console.log('Successfully routed',match.$link.queryString);
    }, (nomatch) => {
      console.log('Unmatched Route', nomatch);
     // this.navCtrl.setRoot("HomePage",{token:this.token});
    });
    this.event.subscribe("trans",(trans:any)=>{
      console.log("trans",trans);
      this.login 			    = trans.login;
      this.home         	= trans.home;
      this.favoritos      = trans.favoritos;
      this.pesquisa       = trans.pesquisa;
      this.codes         	= trans.codes;
      this.sair         	= trans.sair;
      this.page_pesquisa  = trans.page_pesquisa;
      this.load_aguarde   = trans.load_aguarde;
      this.msg_servidor   = trans.msg_servidor;
      this.nome_mc= trans.nome;
      this.sobrenome_mc= trans.sobrenome;
      this.email_mc= trans.email;
      this.empresa= trans.empresa;
      this.segmento= trans.segmento;
      this.cep_mc= trans.cep;
      this.cidade_mc= trans.cidade;
      this.estado_mc= trans.estado;
      this.page= trans.page_conta;
      this.btn_salvar = trans.btn_salvar;
      this.page_login      =trans.page_login;
      this.load_enviando      =trans.load_enviando;
      this.campo_obrigatorio      =trans.campo_obrigatorio;
      this.frase      =trans.frase;
      this.senha      =trans.senha;
      this.esqueceu      =trans.esqueceu;
      this.ou      =trans.ou;
      this.conta      =trans.conta;
      this.email_login      =trans.usuario;
     
    })
    this.event.subscribe("lang",(lang:any)=>{
      console.log("lang",lang);
      this.language =lang;
    });
    //capturar do evento da home
    this.event.subscribe("dados", (data:any) => { 
      console.log(data);
          if(data.logado == "1"){
              this.name    = data.name;
              this.token   = data.token;
              this.email   = data.email;
              this.usuario = data.usuario;
              this.id_serv = data.id_serv;
              this.sobrenome = data.sobrenome;
              this.photo     = data.photo;
              this.mostra  = true;
              this.cnpj  = data.cnpj;
              console.log(data.cnpj);
              this.tp_pessoa = data.tp_pessoa;
              //this.language = data.lang;
             
              
                     
         }else{
               this.mostra    = false;
               this.photo     = "";
               this.name      = "";
               this.token     = undefined;
               this.email     = "";
               this.usuario   = "";
               this.id_serv   = 0;
               this.sobrenome = "";
               this.cnpj      = "";
               this.tp_pessoa = "";
               //this.language = "pt";
            
         }
        
    });
    // aqui eu seto o meu menu
    this.pages = [
      { color:'primary',  icon: 'home',               title: String(this.home),                component: 'HomePage'},
      { color:'primary',  icon: 'contact',            title: String(this.codes),          component: 'MeusCodesPage' },
      { color:'primary',  icon: 'star',               title: String(this.favoritos),      component: 'HistoricoPage'},
      { color:'primary',  icon: 'search',             title: String(this.pesquisa),            component: 'PesquisaPage' },
    // { color:'primary',  icon: 'search',             title: 'Pesquisa',            component: 'EnqueteVotarPage' },
      /*  { color:'primary',  icon: 'search',             title: 'Enquete',             component: 'EnqueteVotarPage' } 
      */
    ];
     console.log(this.pages);
  }
 
  initializeApp() {
    this.platform.ready().then(() => {
     
      this.statusBar.styleDefault();
      this.splashScreen.hide();
       //CHAMDA DO BANCO DE DADOS
      /*  this.usuarioDB.getAll()
       .then((movies:any) => {
           alert("alert deu certo");
       }).catch((erro)=>{
           alert("deu errado"+erro);
       }); */
       /* this.sqliteHelperService.getDb()
       .then((movies:any) => {
           alert("alert deu certo");
       }).catch((erro)=>{
           alert("deu errado"+erro);
       }); */
       if (this.platform.is('ios')){
        this.sqliteHelperService.getDb()
        .then((movies:any) => {
            alert("alert deu certo");
        }).catch((erro)=>{
            alert("deu errado"+erro);
        });
       }
      /*  if (this.platform.is('android')){
         alert("sou android");
       } */
    });
    this.sobrenome= "";
    this.photo = "";
    this.email = "";
   
  
  }
  
  

// redirect push enter
redirectPush(notificationCode){
  
   this.nav.push('DetalheCodePage', {liberado :false,
        code: notificationCode,
        latitude: "", longitude: "",
        telephone: ""
  
  });
 }
  openPage(page) {
    if(page == 2){
          if(this.token == undefined){
            
            this.nav.push('LoginPage',{lang:this.language});
          }else{
            this.nav.push("MeusCodesPage",{token:this.token,lang:this.language});
          }
    }else if(page == 1){
      this.nav.setRoot("HomePage",{token:this.token});
    }
    else if(page == 3 ){ 
           this.nav.push("HistoricoPage",{token:this.token,lang:this.language});
    }else if(page == 4){
      this.nav.push("PesquisaPage",{token:this.token,page_pesquisa:this.page_pesquisa, load_aguarde: this.load_aguarde,
        msg_servidor:this.msg_servidor});
    }
    else if(page == 5){
      this.nav.push("BonusPage",{token:this.token,lang:this.language,page_pesquisa:this.page_pesquisa, load_aguarde: this.load_aguarde,
        msg_servidor:this.msg_servidor});
    }
    else if(page == 6){
      this.nav.push("CupomPage",{token:this.token,page_pesquisa:this.page_pesquisa, load_aguarde: this.load_aguarde,
        msg_servidor:this.msg_servidor,cupom:this.cnpj});
    }
  
  }
 
  minhaConta(){
    console.log("token",this.token);
    if(this.token == undefined){
      console.log("porrta",this.language)
      this.nav.push('LoginPage',{lang:this.language});
    }else{
        let myModal =this.modalCtrl.create('MinhaContaPage',{token:this.token,lang:this.language
          ,nome: this.nome_mc
          ,sobrenome: this.sobrenome_mc
          ,email: this.email_mc
          ,empresa: this.empresa
          ,segmento: this.segmento
          ,cep: this.cep_mc
          ,cidade: this.cidade_mc
          ,estado: this.estado_mc
          ,page: this.page
          ,btn_salvar : this.btn_salvar,
          msg_servidor : this.msg_servidor,
          load_aguarde :this.load_aguarde
        
        });
        myModal.present();
    }
    
  }
  loginIN(){
    this.nav.setRoot('LoginPage',{lang:this.language});
  }
   //sair eu atualizo os dados
   logout(){
    this.usuarioService.update(this.name,this.sobrenome,this.email,"","","","0",this.token,this.id_serv)
    .then((data: any) => {
            if(data){
              console.log("uusuario atualizado");
            }
    });
    this.nav.push('LoginPage',{lang:this.language});
 }
}

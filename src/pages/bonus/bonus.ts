import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,ModalController, Slides } from 'ionic-angular';
//Import Provider
import { Chart } from 'chart.js';
import { ClienteProvider } from './../../providers/cliente/cliente';
import { Validators, FormBuilder } from '@angular/forms';
import { UtilService } from '../../providers/util/util.service';
import { NetworkProvider } from '../../providers/network/network';
import { TranslateService } from '@ngx-translate/core';
@IonicPage({
  priority : 'low',
  segment  : 'Bonus/:cupom/:token/:id/:lang',
  defaultHistory:['HomePage']
})
@Component({
  selector: 'page-bonus',
  templateUrl: 'bonus.html',
})
export class BonusPage {
  @ViewChild('mySlider') slider: Slides;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  cupom : any;
  token : String;
  estab : any[];
  id_serv:any;
  not    : Number;
  saldo  :String;
  isSaldo :Boolean=false ;
  total_receber :String;
  selectedSegment      : string;
  //charts
 
  option1   : Number;
  option2   : Number;
  label1    : String;
  label2    : String;
  code_id   :String;
  ask_id    : String;
  model : Cliente_Edit;
  cliente : any[];
  load_enviando: any;
  //validação de formulario
  public cadastroForm: any;
  history:any[];
  //charts
  @ViewChild('barCanvas') barCanvas;

  barChart: any;
  doughnutChart: any;
  erroragencia: boolean;
  messageagencia: any;
  campo_obrigatorio: any;
  errorconta: boolean;
  messageconta: any;
  errortitular: boolean;
  messagetitular: any;
  errorcpf: boolean;
  messagecpf: any;
  errorbanco: boolean;
  messagebanco: any;
  errortipo: boolean;
  messagetipo: any;
  label:any[];
  value:any[];
  backColor:any[];
  borderColor:any[];
  dadosServe:any[];
  dadosFiltro:any[];
  banco;
  tipo;
  agencia;
  conta;
  titular;
  cpf;
  bonus;
  dt_pgto;
  valor;
  //tradução
  saldo_dp;
  ult_pgto;
  seg_resumo;
  seg_indica;
  seg_info;
  question;
  indica;
  indica_list;
  tp_conta;
  C_Poupanca;
  c_Corrente;
  lang: string;
  msg_servidor: any;
  page: any;
  texto: any;
  load_aguarde: any;
  btn_salvar: any;
  texto1: any;
  texto2: any;
  pesquisa: pesquisa;
  resultado: any;
    constructor(
                public navCtrl       : NavController, 
                public navParams     : NavParams, 
                private cli_Provider : ClienteProvider ,
                private toast        : ToastController, 
                formBuilder          : FormBuilder,
                public  util         : UtilService,
                public  net          : NetworkProvider,
                public modalCtrl     : ModalController,
                private translate 	  : TranslateService
              ) {
                this.selectedSegment = '0';
                //instacia o cliente para
              this.model = new Cliente_Edit();
              this.pesquisa = new pesquisa();
              //instancia do formulario builder para validar os campos
               this.cadastroForm = formBuilder.group({
                 banco        : ['', Validators.required],
                 tipo         : ['', Validators.required],
                 agencia      : ['', Validators.required],
                 conta        : ['', Validators.required],
                 titular      : ['', Validators.required],
                 cpf      : ['', Validators.required]
                
               });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad BonusPage');
    this.id_serv      ="";
   
    this.cupom        = this.navParams.get('cupom');
    this.token        = this.navParams.get('token');
    this.id_serv      = this.navParams.get('id');
    this.lang         = this.navParams.get('lang');
    this.estab        = [];
    this.not          = 0;
    this.cliente      = [];
    this.history      = [];
    this.label        = [];
    this.value        = [];
    this.backColor    = [];
    this.borderColor  = [];
    this.dadosServe   = [];
    this.dadosFiltro   = [];
    this.campo_obrigatorio = "Este campo é obrigatório";
    //this.getAllEstabelecimentoBonus();
    let now = new Date();
    let myDate: String = new Date().toISOString();
    console.log(myDate);
    this.pesquisa.data_init = myDate;
    this.pesquisa.data_fim = myDate;

    this._translateLanguage();
    this.getCupom();
    this.getConta();
    
  }

 
  calcbar(){
    ///monta o gráfico
    console.log(this.history);
    for (let index = 0; index < this.history.length; index++) {
      const element = this.history[index];
      this.label.push(element.date);
      this.value.push(element.value.replace(",","."));
      this.backColor.push('rgba(54, 162, 235, 0.2)');
      this.borderColor.push('rgba(54, 162, 235, 1)');
    }
    console.log(this.label,this.value,this.backColor,this.borderColor);
    this.barChart = new Chart(this.barCanvas.nativeElement, {

        type: 'bar',
        data: {
            labels: this.label,
            datasets: [{
                label: '# Ganhos em R$',
                data: this.value,
                backgroundColor:this.backColor,
                borderColor: this.borderColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }

    });
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
      }else if(currentSlide == 1){
          this.selectedSegment = '1';
      }else if(currentSlide == 2){
        this.selectedSegment = '2';
      }
     
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
        this.saldo_dp         = this.translate.instant("bonus.saldo_dp");
        this.ult_pgto         = this.translate.instant("bonus.utl_pgto");
        this.seg_resumo       = this.translate.instant("bonus.seg_1");
        this.seg_indica       = this.translate.instant("bonus.seg_2");
        this.seg_info         = this.translate.instant("bonus.seg_3");
        this.question         = this.translate.instant("bonus.utl_pgto");
        this.indica           = this.translate.instant("bonus.indica");
        this.indica_list      = this.translate.instant("bonus.utl_pgto");
        this.tp_conta         = this.translate.instant("bonus.tp_conta");
        this.c_Corrente       = this.translate.instant("bonus.c_Corrente");
        this.page             = this.translate.instant("bonus.page");
        this.C_Poupanca       = this.translate.instant("bonus.C_Poupanca");
        this.texto1           = this.translate.instant("bonus.texto_1");
        this.texto2           = this.translate.instant("bonus.texto_2");
        this.C_Poupanca       = this.translate.instant("bonus.C_Poupanca");
        this.load_enviando    = this.translate.instant("default.load_enviando");
        this.msg_servidor     = this.translate.instant("default.msg_servidor");
        this.page             = this.translate.instant("meus_contatos.page");
        this.texto            = this.translate.instant("meus_contatos.texto");
        this.load_aguarde     = this.translate.instant("default.load_aguarde");
        this.btn_salvar       = this.translate.instant("default.btn_salvar");
        this.resultado        = this.translate.instant("default.pesquisa");
         
        console.log(this.texto1,this.texto2);
       }, 250);
    }

getCupom(){
  this.cli_Provider.getCupom(this.token)
  .subscribe(
        (result: any) =>{
              console.log("result",result);
              this.cliente = result.users_cupom;
              this.dadosServe = result.history;
              this.history = result.history;
              this.bonus   = result.bonus.saldo;
              this.dt_pgto = result.bonus.last_pagto.date;
              this.valor = result.bonus.last_pagto.value;

              console.log(this.cliente);
              this.calcbar();
        });
    
}
compareFn(e1: String, e2: String): boolean {
  return e1 && e2 ? e1 === e2 : e1 === e2;
}

change_tipo($event) {
  this.model.tipo =$event;
  console.log($event);
  
}
change_banco($event) {
  this.model.banco =$event;
  console.log($event);
}
doRefresh(refresher) {
    
      setTimeout(() => {
        this.cliente=[];
        this.label=[];
        this.value=[];
        this.backColor=[];
        this.borderColor =[];
      // this.getAllEstabelecimentoBonus();
      this.getCupom();
      this.getConta();
      
        refresher.complete();
    
      }, 2000);
}
getConta(){
  this.util.showLoading(this.load_enviando);
  if(this.net.ckeckNetwork()){
    this.cli_Provider.setConta(this.lang,this.token,"get_conta",this.model.banco,this.model.tipo,this.model.agencia,this.model.conta,this.model.titular,this.model.cpf)
    .subscribe(
          (result: any) =>{
            console.log(result);
            this.util.loading.dismiss(); 
              if(result.status == 200){
                this.model.banco = result.info_conta.banco;
                this.model.tipo = result.info_conta.tp_conta;
                this.agencia = result.info_conta.agencia;
                this.cpf = result.info_conta.cpf;
                this.titular = result.info_conta.titular;
                this.conta = result.info_conta.n_conta;
              //  this.toast.create({ message: result.messagem, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                 
              }
      })
  }


}
setConta(){
  let {banco,tipo, agencia, conta,titular,cpf } = this.cadastroForm.controls;
    console.log("entrei aqui setconta");
  if (!this.cadastroForm.valid) {
            if (!banco.valid) {
              this.errorbanco = true;
              this.messagebanco = this.campo_obrigatorio;
            } else {
              this.messagebanco = "";
              console.log("entrei aqui 1");
            }
            if (!tipo.valid) {
              this.errortipo = true;
              this.messagetipo = this.campo_obrigatorio;
            } else {
              this.messagetipo = "";
              console.log("entrei aqui 2");
            }
        

            if (!agencia.valid) {
              this.erroragencia = true;
              this.messageagencia = this.campo_obrigatorio;
            } else {
              this.messageagencia = "";
              console.log("entrei aqui 3");
            }
        
            if (!conta.valid) {
              this.errorconta = true;
              this.messageconta =this.campo_obrigatorio;
            } else {
              this.messageconta = "";
              console.log("entrei aqui 4");
            }
            if (!titular.valid) {
              this.errortitular = true;
              this.messagetitular =this.campo_obrigatorio;
            } else {
              this.messagetitular = "";
              console.log("entrei aqui 5");
            }
            if (!cpf.valid) {
              this.errorcpf = true;
              this.messagecpf =this.campo_obrigatorio;
            } else {
              this.messagecpf = "";
              console.log("entrei aqui 6");
            }
  }
  else {
    console.log("entrei aqui 2321312");
        this.util.showLoading(this.load_enviando);
        if(this.net.ckeckNetwork()){
          this.cli_Provider.setConta(this.lang,this.token,"set_conta",this.model.banco,this.model.tipo,this.model.agencia,this.model.conta,this.model.titular,this.model.cpf)
          .subscribe(
                (result: any) =>{
                  console.log(result);
                  this.util.loading.dismiss(); 
                    if(result.status == 200){

                      this.toast.create({ message: result.messagem, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                       
                    }
            })
        }

      }   
  }
searchList(){
 
    /* for (let index = 0; index < this.history.length; index++) {
      const element = this.history[index];
     
     // element.date = this.replace(element.date);
     let dt1;
    //  dt1 = element.date.replace("/",".");
//      dt1 = dt1.replace("/",".");
      let dt_init= this.formatDate(this.pesquisa.data_init);
      let dt_fim= this.formatDate(this.pesquisa.data_fim);
      console.log(   Date.parse(dt_fim));
      if(dt1 >= dt_init && dt1 <= dt_fim ){
            this.dadosFiltro.push(element);
      }

    } */
    this.util.showLoading(this.load_aguarde);
    this.cli_Provider.getCupom_Date(this.token,this.pesquisa.data_init,this.pesquisa.data_fim).subscribe(
      (result: any) =>{
            console.log("result",result);
            this.util.loading.dismiss();
            this.history=[];
            this.label = [];
            this.backColor =[];
            this.borderColor =[];
            this.value =[];
            this.history = result.history;
            this.calcbar();
            console.log(this.dadosFiltro);
            if(result.history.length == 0){
              this.toast.create({ message: this.resultado, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                 
            }
    
      });
  }
   formatDate (input) {
    var datePart = input.match(/\d+/g),
    year = datePart[0], // get only two digits
    month = datePart[2], day = datePart[1];
  
  //  console.log(day+month+year);
    return(day+"."+month+"."+year);
  }
}

export class Cliente_Edit {
  public banco      : String;
  public tipo       : String;
  public agencia    : String;
  public conta      : String;
  public digito     : String;
  public titular    : String;
  public cpf        : String;
  
 
}
export class pesquisa
 {
  public data_init  : String;
  public data_fim   : String;
 }
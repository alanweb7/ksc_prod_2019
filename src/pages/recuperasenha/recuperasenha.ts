import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { CodeProvider } from './../../providers/code/code';
import { NetworkProvider } from '../../providers/network/network';



@IonicPage()
@Component({
  selector: 'page-recuperasenha',
  templateUrl: 'recuperasenha.html',
})
export class RecuperasenhaPage {
//validação de formulario
public loginForm: any;
erro=false;
message="";
messageEmail = "";
errorEmail = false;
email :any;
class ="";
  page: any;
  texto_1: any;
  texto_2: any;
  text_email;
  campo_obrigatorio: any;
  lang: any;

  constructor(
                public navCtrl         : NavController, 
                public navParams       : NavParams,
                formBuilder            : FormBuilder ,
                public toast           : ToastController,
                public net             : NetworkProvider,
                private codeProvider   : CodeProvider,
              ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecuperasenhaPage');
    this.page              = this.navParams.get('page');
    this.texto_1           = this.navParams.get('texto_1');
    this.texto_2           = this.navParams.get('texto_2');
    this.text_email        = this.navParams.get('email');
    this.campo_obrigatorio        = this.navParams.get('campo_obrigatorio');
    this.lang        = this.navParams.get('lang');
    }
  closeModal() {
    this.navCtrl.pop();
  }
  forgotpass(){
    let { email } = this.loginForm.controls;
        if (!this.loginForm.valid) {
                  if (!email.valid) {
                    this.errorEmail = true;
                    this.messageEmail = this.campo_obrigatorio;
                       this.class = "danger";
                  } else {
                    this.messageEmail = "";
                  }
              
                 
        }
        else {
              if(this.net.ckeckNetwork()){
                    this.codeProvider.forgotpass(this.email,this.lang)
                        .subscribe(
                                (result: any) =>{
                                  if(result.status == 200){
                                    this.toast.create({ message: result.message, position: 'botton', duration: 4000 ,closeButtonText: 'Ok!',cssClass: 'sucesso'  }).present();
                                    this.navCtrl.push('LoginPage',{lang:this.lang});  
                                  }if(result.status == 403){
                                    this.toast.create({ message: result.message, position: 'botton', duration: 4000 ,closeButtonText: 'Ok!',cssClass: 'erro'  }).present();
                                
                                  }
                        },(error:any) => {
                              if(error.status){
                                   this.message      = "";
                              }else{
                                    this.erro         = true;
                                    this.message      ='Email não encontrado';
                                    this.messageEmail = "";
                                    this.class        = "danger";
                                  
                              }
                
                      });

                  }else{
                      this.navCtrl.setRoot('NotNetworkPage');
                  
                  }
            
               
        }
  }
}

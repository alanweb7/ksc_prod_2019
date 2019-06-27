import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';
import { HomePage } from '../home/home';


/**
 * Generated class for the CupomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  priority : 'low',
  segment  : 'Cupom/:cupom/:token/:nome/:sobrenome/:cupom',
  defaultHistory:['HomePage']
})
@Component({
  selector: 'page-cupom',
  templateUrl: 'cupom.html',
})
export class CupomPage {
  cupom : any;
  token : String;
  estab : any[];
  nome  : any;
  sobrenome : any;
  not    : Number;
  constructor( private socialSharing: SocialSharing ,
               public navCtrl: NavController, 
               private nativeStorage     : NativeStorage, 
               public navParams: NavParams, 
               public modalCtrl: ModalController) {
  }
  
  voltar() {
    this.navCtrl.setRoot(HomePage);
  }
  
  cupomModal() {
    let myModal = this.modalCtrl.create('CupomModalPage');
    myModal.present();
  }
  regularShare(){
    var msg  = "Inscreva-se usando este link:https://kscode.com.br/checkout/?add-to-cart=1351?promo_code="+this.cupom;
     this.socialSharing.share(msg, null, null);
   }
   
  ionViewDidLoad() {
    this.cupom        = this.navParams.get('cupom');
    this.token        = this.navParams.get('token');
    this.nome         = String;
    this.sobrenome    = String;
    this.nome         = "";
    this.not          = 0;
    this.sobrenome    = "";
    this.nome         = this.navParams.get('name');
    this.sobrenome    = this.navParams.get('sobrenome');
    console.log('ionViewDidLoad CupomPage');
  }
  
  


}


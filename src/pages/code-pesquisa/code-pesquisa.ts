import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';

import { CodeProvider } from './../../providers/code/code';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
/**
 * Generated class for the CodePesquisaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-code-pesquisa',
  templateUrl: 'code-pesquisa.html',
})
export class CodePesquisaPage {
  codes:any;
  results: Object;
  campo;
  isLoading:String;
  //searchTerm       : string = '';
  searchTerm$ = new Subject<string>();
  ////teste
  searchTerm: string = '';
  searchControl: FormControl;
  items: any;
  searching: any = false;
  token;
  language: any;
  page: any;
  texto: any;
  endLat: any;
  endLong: any;
  title: any;
  constructor( 
                private geoProv       : GeolocationProvider,
                public navCtrl        : NavController,
                public toast          : ToastController,   
                public modalCtrl      : ModalController, 
                public navParams      : NavParams,  
                private codeProvider  : CodeProvider
          ) {
     this.searchControl = new FormControl();
  
  }

  ionViewDidLoad() {
    this.isLoading = "";
    this.language         = this.navParams.get('lang');
    this.token            = this.navParams.get('token');
    this.campo            = this.navParams.get('campo');
    this.page             = this.navParams.get('page_pesquisa');
    this.texto            = this.navParams.get('texto');
    this.title            = this.navParams.get('title');
    this.pushGeoinfo();
    this.searchControl.valueChanges.debounceTime(300).subscribe(search => {
       console.log(search);
        this.searching = false;
        this.setFilteredItems();

    });
  }
  onSearchInput(){
    this.searching = true;
}
setFilteredItems() {

  this.codes=[];
  this.isLoading="true";
  this.searching = true;
  if(!this.searchTerm){
    this.codes=[];
    this.isLoading="";
    this.searching = false;
    this.onCancel();
 }else{

   this.codeProvider.searchEntries(this.searchTerm)
   .subscribe((results: any )=> {
    this.searching = false;
     this.codes = results;
     if(this.codes <= 0){
      this.toast.create({ message:this.texto, position: 'botton', duration: 3000 ,closeButtonText: 'Ok!',cssClass: 'alerta'  }).present();
                
     }
     this.isLoading="";
   });
 } 
 

}
 closeModal() {
  this.navCtrl.pop();
}
  onCancel(){
  
    this.isLoading="";
    this.searching = false;
    return this.codes =[];
  
  }
  pushPage(code){

        this.navCtrl.push('DetalheCodePage', {liberado :false,origem:4,token:this.token,lang:this.language,
          code: code,
          latitude: this.endLat, longitude: this.endLong,
          telephone: ""
        
        });
  }
      
  pushGeoinfo(){
   
    this.geoProv.getGeolocation().then((resp:String[])=>{
  
      this.endLat = resp["latitude"];
      this.endLong = resp["longitude"];
      
     });
 
  }  
  
}

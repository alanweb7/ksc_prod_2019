import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation'
import { Diagnostic } from '@ionic-native/diagnostic';
@Injectable()
export class GeolocationProvider {
 lat: any;
 lng: any;
 resp:any[];
  
  constructor(private diagnostic: Diagnostic,public geo: Geolocation) {
     this.resp=[];
    
  }
  getGeolocation():Promise<String[]>{
    return<Promise<String[]>>this.diagnostic.isGpsLocationEnabled().then((isAvailable:any)=>{
      if(isAvailable){
        return<Promise<String[]>> this.geo.getCurrentPosition().then( pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
            this.resp['latitude']  = this.lat;
            this.resp['longitude'] = this.lng;
            this.resp['result']    = true;
            return this.resp;  
          }).catch( err => console.log(err)); 
      }else{
        this.resp['result']    = false;
        this.resp['latitude']  = "";
        this.resp['longitude'] = "";
        return this.resp;  
      }

   }).catch( err => console.log(err));
  
  }
 
 
    

}
   



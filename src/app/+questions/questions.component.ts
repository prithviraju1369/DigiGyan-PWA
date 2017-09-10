import { Component ,AfterViewInit, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';

declare var swRegistration: any;

@Component({
    selector: 'questions',
    styleUrls:['./questions.component.scss'],
    templateUrl: './questions.component.html',
})
export class QuestionsComponent implements AfterViewInit{

    isSubscribed:boolean;

    constructor(private el: ElementRef,private router: Router,private http: Http) {
        if(!sessionStorage.getItem('username_id')){
            this.router.navigate(['./login']);
        }
    }

    ngAfterViewInit(){
        this.pushInitialize();
    }

    pushInitialize(){
        let self=this;
        let result = self.http.get(`/profileapi/getVpad`)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json().error || 'Server error')).subscribe(x=>{
                if(x){
                    let convertedVapidKey = self.urlBase64ToUint8Array(x.val);
                    swRegistration.pushManager.subscribe(
                        {
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidKey
                        }
                    ).then(function(sub) {
                        if(sub){

                            let mySub=JSON.parse(JSON.stringify(sub));
                            console.log(mySub)
                            self.updateSubscriptionOnServer(mySub);
                        }
                    });
                }            
            })
        
    }

    urlBase64ToUint8Array(base64String){
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
     
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
     
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    updateSubscriptionOnServer(subscription){
        let obj:any={};
        obj.endPoint=subscription.endpoint;
        obj.keys={};
        obj.keys.p256dh=subscription.keys.p256dh;
        obj.keys.auth=subscription.keys.auth;
        let myObj={
            user:sessionStorage.getItem('username_id'),
            data:obj
        }

        let result = this.http.post(`/profileapi/subscription`,myObj)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json().error || 'Server error')).subscribe(x=>{
                    console.log(x);
                })
        


     
    }
    
};
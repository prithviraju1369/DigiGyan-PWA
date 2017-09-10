import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';

import {MdSnackBar} from '@angular/material';

declare var PouchDB: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit, OnInit {
  title = 'app works!';
  online$: Observable<boolean>;
  offLine:boolean=false;
  pouchInstance:any;

  constructor(public snackbar:MdSnackBar,private http: Http) {
    this.pouchInstance=new PouchDB('DigiGyan');
    this.online$ = Observable.merge(
      Observable.of(navigator.onLine),
      Observable.fromEvent(window, 'online').mapTo(true),
      Observable.fromEvent(window, 'offline').mapTo(false)
    )
    this.online$.subscribe((x)=>{
      let self=this;
      let msg=''
      if(x===true){
        msg='App is Online';
        self.offLine=false;
        self.snackbar.open(msg, 'Okay',{
          duration: 2000,
        });
        self.syncData();
      }else if(x===false){
        if(navigator.onLine){
          msg='App is Online';
          self.offLine=false;
          self.snackbar.open(msg, 'Okay',{
            duration: 2000,
          });
        }else{
          msg='App is Offline';
          self.offLine=true;
          self.snackbar.open(msg, 'Okay',{
            duration: 2000,
          });
        }

      }
    })
  }

  ngOnInit() {
    let self=this;
    let arr=[];
    self.pouchInstance.get('offline').then(function (doc) {
    }).catch(function (err) {
      self.pouchInstance.put({_id:'offline',val:arr}).then(function (response) {
      }).catch(function (err) {
          console.log(err)
      });
    });
    
  }

  syncData(){
    let self=this;
    self.pouchInstance.get('offline').then(function (doc) {
      if(doc && doc.val && doc.val.length>0){
        for(let i=0;i<doc.val.length;i++){
          self.pushToServe(doc.val[i]);
        }
        self.pouchInstance.get('offline').then(function(doc) {
          doc.val.length=0;;  
          return self.pouchInstance.put({
            _id: 'offline',
            _rev: doc._rev,
            val:doc.val
          });
        }).then(function(response) {
        }).catch(function (err) {
        });
      }
    });
  }

  pushToServe(obj){
    let msg='';
    let self=this;
    let result = this.http.post(obj.url,obj.data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    result.subscribe(x=>{
      msg= 'Your '+obj.type+ ' : '+obj.title+' has been synced to server';
      self.snackbar.open(msg, 'Okay',{
          duration: 2000,
        });
    })
  }

  ngAfterViewInit() {
  }

}
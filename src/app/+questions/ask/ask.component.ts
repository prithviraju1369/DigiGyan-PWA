import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { question,tag } from './../../modal/profile';

import { QuestionsService } from './../questions.service';

import {MdSnackBar} from '@angular/material';

declare var PouchDB: any;

@Component({
    selector: 'ask',
    templateUrl: './ask.component.html',
    styleUrls:['./../questions.component.scss'],
    providers:[QuestionsService]
})
export class AskComponent implements OnInit {
	question:question={};
	tags:tag[]=[];
    userId:string;
    pouchInstance:any;

    constructor(private router: Router,private _questionsService: QuestionsService,public snackbar:MdSnackBar) {
        this.pouchInstance=new PouchDB('DigiGyan');
    }

    ngOnInit() {
        this.userId=sessionStorage.getItem('username_id');

        this.getAllTags()
    }

     getAllTags(){
        let self=this;
        let tagsRes=this._questionsService.getAllTags();
        tagsRes.subscribe((x)=>{
            if(x && x.length>0){
                self.tags=x;
                self.addToLocalDB('tags',self.tags);
            }
        },(err)=>{
            self.pouchInstance.get('tags').then(function (doc) {
              self.tags=doc.val;
            }).catch(function (err) {
              console.log(err);
            });
        });
    }

    addToLocalDB(id,val){
        console.log(id)
        if(val && val.length>0){
        let self=this;
        self.pouchInstance.get(id).then(function(doc) {
                  return self.pouchInstance.put({
                    _id: id,
                    _rev: doc._rev,
                    val:val
                  });
                }).then(function(response) {
                }).catch(function (err) {
                  if(err.status==404){
                     self.pouchInstance.put({_id:id,val:self.question}).then(function (response) {
                        }).catch(function (err) {
                            console.log(err)
                        }); 

                  }
                });
                }
    }

    submit(){
        let self=this;
        let msg='';
        if(self.userId){
            self.question.user=self.userId;
            self.question.tags=[];
            let found = false;
            for(var i = 0; i < self.tags.length; i++) {
                if (self.tags[i].selected) {
                    found = true;
                    console.log(self.tags[i]);
                    self.question.tags.push(self.tags[i]._id);
                }
            }
            if(!found){
                msg='select atleast one tag';
                self.snackbar.open(msg, 'Okay',{
                  duration: 2000,
                });
            }else{
                if(!self.question.title || !self.question.description){
                    msg='please fill the fields';
                    self.snackbar.open(msg, 'Okay',{
                      duration: 2000,
                    });
                }else{
                    
                    let registerRes=self._questionsService.addQuestion(self.question);
                    registerRes.subscribe((x)=>{
                        if(x && x.code==200){
                            if(x.valMsg){
                                self.snackbar.open(x.valMsg, 'Okay',{
                                  duration: 2000,
                                });
                            }else{
                                self.question={};
                                self.snackbar.open(x.msg, 'Okay',{
                                  duration: 2000,
                                });
                                self.router.navigate([`./question/${x.id}`])
                            }
                        }
                    },(err)=>{
                        let offLine:any={};
                        offLine.url='/profileapi/addQuestion';
                        offLine.data=self.question;
                        offLine.title=self.question.title.substring(0, 8);
                        offLine.type='question';
                        self.pouchInstance.get('offline').then(function(doc) {
                          doc.val.push(offLine);  
                          return self.pouchInstance.put({
                            _id: 'offline',
                            _rev: doc._rev,
                            val:doc.val
                          });
                        }).then(function(response) {
                          msg='You Question will Sync. When device is Online';
                          self.question={};
                          self.snackbar.open(msg, 'Okay',{
                            duration: 2000,
                          });
                        }).catch(function (err) {
                        });
                    })
                    }
            }

        }
    }

};
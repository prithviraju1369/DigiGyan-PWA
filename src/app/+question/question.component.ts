import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params  } from '@angular/router';

import { question,tag } from './../modal/profile';

import { QuestionService }   from './question.service';

import {Observable} from 'rxjs/Rx';

import {MdSnackBar} from '@angular/material';

declare var PouchDB: any;

@Component({
    selector: 'question',
    styleUrls:['./question.component.scss'],
    templateUrl: './question.component.html',
    providers:[QuestionService]
})
export class QuestionComponent implements OnInit {
	question:any={};
    questionFound:boolean=true;
	qId:string;
    answerIt:boolean;
    description:string;
    userId:string;
    pouchInstance:any;

    constructor(private router: Router,private route: ActivatedRoute,private _questionService: QuestionService,public snackbar:MdSnackBar) {
        this.userId=sessionStorage.getItem('username_id');
        this.pouchInstance=new PouchDB('DigiGyan');
    	let question=this.route.params
            .switchMap((params: Params) => {
                this.qId = params['id'];
                return Observable.from([1,2,3]).map(x=>x);
            });
        question.subscribe(c=>console.log(c));
    }

    ngOnInit() {
    	this.getQuestion();
    }

    answerQuestion(){
        this.answerIt=!this.answerIt;
    }

    addToCache(question:any){
        let self=this;
        
        self.pouchInstance.get('question').then(function(doc) {
        if(doc.val && doc.val.length<2){
            let arr=[];
            if(doc.val.length!=0){
                arr.push(doc.val[0]);
            }
            arr.push(self.question);
          return self.pouchInstance.put({
            _id: 'question',
            _rev: doc._rev,
            val: arr
          });
          }else{
            var temp=doc.val;
            var tempArr=temp.splice(0,1);
            temp.push(self.question);
            return self.pouchInstance.put({
                _id: 'question',
                _rev: doc._rev,
                val: temp
              });
          }
        }).then(function(response) {
        }).catch(function (err) {
          if(err.status==404){
            let arr=[];
            arr.push(self.question);
             self.pouchInstance.put({_id:'question',val:arr}).then(function (response) {
                }).catch(function (err) {
                    console.log(err)
                }); 

          }
        });
    }

    getQuestion(){
    	let self=this;
    	let question=self._questionService.getQuestion(this.qId);
        question.subscribe((x)=>{
            if(x){
                self.question=x;
                self.questionFound=true;
                self.addToCache(self.question);
            }
        },(err)=>{
            self.pouchInstance.get('question').then(function(doc){
                if(doc.val && doc.val.length>0){
                    let obj=doc.val.filter(function(a){
                        return a._id==self.qId;
                    })
                    if(obj && obj.length>0){
                        self.question=obj[0];
                        self.questionFound=true;
                    }else{
                        self.questionFound=false;
                    }
                }else{
                    self.questionFound=false;
                }
            }).catch(function(err){

            })
        })
    }

    submit(){
        let msg='';
        let self=this;
        if(this.description){

            let addComment=self._questionService.addComment(self.qId,self.userId,self.description);
            addComment.subscribe((x)=>{
                if(x){
                    self.description='';
                    self.question=x;
                    self.questionFound=true;
                    this.answerIt=!this.answerIt;
                }
            },(err)=>{
                let offLine:any={};
                offLine.url='/profileapi/addComment';
                offLine.data={qId:self.qId,user_id:self.userId,comment:self.description};
                offLine.title=self.description.substring(0, 8);
                offLine.type='comment';
                self.pouchInstance.get('offline').then(function(doc) {
                  doc.val.push(offLine);  
                  return self.pouchInstance.put({
                    _id: 'offline',
                    _rev: doc._rev,
                    val:doc.val
                  });
                }).then(function(response) {
                    self.description='';
                  msg='You Comment will Sync. When device is Online';
                  self.question={};
                  self.snackbar.open(msg, 'Okay',{
                    duration: 2000,
                  });
                }).catch(function (err) {
                });
            })
        }else{
            msg='Please enter comment';
            self.snackbar.open(msg, 'Okay',{
                                  duration: 2000,
                                });
        }

    }

    likeIt(comment:any){
        let msg='';
        let self=this;
        let addLike=self._questionService.addLike(self.qId,comment._id,self.userId);
        addLike.subscribe((x)=>{
            if(x){
                self.question=x;
                msg='Liked';
                self.snackbar.open(msg, 'Okay',{
                                  duration: 2000,
                                });
            }
        },(err)=>{
            let offLine:any={};
                offLine.url='/profileapi/addLike';
                offLine.data={qId:self.qId,commentId:comment._id,userId:self.userId};
                offLine.title=comment.text.substring(0, 8);
                offLine.type='Like';
                self.pouchInstance.get('offline').then(function(doc) {
                  doc.val.push(offLine);  
                  return self.pouchInstance.put({
                    _id: 'offline',
                    _rev: doc._rev,
                    val:doc.val
                  });
                }).then(function(response) {
                  msg='You Like will Sync and reflect. When device is Online';
                  self.question={};
                  self.snackbar.open(msg, 'Okay',{
                    duration: 2000,
                  });
                }).catch(function (err) {
                });
        })
        
    }

    checkLiked(arr){
        if(arr.length==0) return true;
        let val=arr.filter(this.checker);
        if(val){return false;}else{return true;}
    }

    checker(val){
        if(val==sessionStorage.getItem('username_id')){
            return true;
        }else{
            return false;
        }
    }

};
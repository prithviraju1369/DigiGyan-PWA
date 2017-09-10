import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params  } from '@angular/router';

import { question,tag } from './../modal/profile';

import { QuestionService }   from './question.service';

import {Observable} from 'rxjs/Rx';

import {MdSnackBar} from '@angular/material';

@Component({
    selector: 'question',
    styleUrls:['./question.component.scss'],
    templateUrl: './question.component.html',
    providers:[QuestionService]
})
export class QuestionComponent implements OnInit {
	question:any={};
	qId:string;
    answerIt:boolean;
    description:string;
    userId:string;
    constructor(private router: Router,private route: ActivatedRoute,private _questionService: QuestionService,public snackbar:MdSnackBar) {
        this.userId=sessionStorage.getItem('username_id');
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

    getQuestion(){
    	let self=this;
    	let question=self._questionService.getQuestion(this.qId);
        question.subscribe((x)=>{
            if(x){
                self.question=x;
            }
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
                    this.answerIt=!this.answerIt;
                }
            })
        }else{
            msg='Please enter comment';
            self.snackbar.open(msg, 'Okay',{
                                  duration: 2000,
                                });
        }

    }

    likeIt(comment:any){
        console.log(comment)
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
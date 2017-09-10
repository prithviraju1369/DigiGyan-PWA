import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { question,tag } from './../../modal/profile';

import { QuestionsService } from './../questions.service';

import {MdSnackBar} from '@angular/material';

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
    // redirect to home page
    constructor(private router: Router,private _questionsService: QuestionsService,public snackbar:MdSnackBar) {
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
            }
        });
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
                    })
                }
            }

        }
    }

};
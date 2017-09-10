import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tag,question } from './../../modal/profile';

import { QuestionsService }   from './../questions.service';

@Component({
    selector: 'my',
    templateUrl: './../questionsLayout.html',
    styleUrls:['./../questions.component.scss'],
    providers:[QuestionsService]
})
export class MyComponent implements OnInit {
	search:any;
    userId:any;
    questions:question[];
    constructor(private router: Router, private _questionsService: QuestionsService) {
    	this.userId=sessionStorage.getItem('username_id');
    }

    ngOnInit() {
        this.getMyContent();
    }

    getMyContent(){
        let self=this;
        let myCont=self._questionsService.getMyContent(this.userId)
        myCont.subscribe((x)=>{
            if(x && x.length>0){
                this.questions = x;
            }
        })
    }

};
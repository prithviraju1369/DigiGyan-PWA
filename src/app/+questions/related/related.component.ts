import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params  } from '@angular/router';
import { tag,question } from './../../modal/profile';

import { QuestionsService }   from './../questions.service';

@Component({
    selector: 'related',
    templateUrl: './../questionsLayout.html',
    styleUrls:['./../questions.component.scss'],
    providers:[QuestionsService]
})
export class RelatedComponent implements OnInit {
	questions:question[];
	search:any;
    userId:any;
    constructor(private router: Router,private _questionsService: QuestionsService) {
        this.userId=sessionStorage.getItem('username_id');
    }

    ngOnInit() {
        this.getRelatedContent();
    }

    getRelatedContent(){
        let self=this;
        let relatedCont=self._questionsService.getRelatedContent(this.userId)
        relatedCont.subscribe((x)=>{
            if(x && x.length>0){
                this.questions = x;
            }
        })
    }


};
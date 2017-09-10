import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tag,question } from './../../modal/profile';

import { QuestionsService }   from './../questions.service';

import { Subject } from 'rxjs/Subject'

declare var PouchDB: any;

@Component({
    selector: 'my',
    templateUrl: './../questionsLayout.html',
    styleUrls:['./../questions.component.scss'],
    providers:[QuestionsService]
})
export class MyComponent implements OnInit {
    userId:any;
    questions:question[];
    private searchTermStream = new Subject<string>()
    pouchInstance:any;
    
    constructor(private router: Router, private _questionsService: QuestionsService) {
    	this.userId=sessionStorage.getItem('username_id');
        this.pouchInstance=new PouchDB('DigiGyan');
    }

    search(terms: string) {
        this.searchTermStream.next(terms);
      }

    ngOnInit() {
    	let self=this;
        this.getMyContent();
        const searchSource = this.searchTermStream
        .debounceTime(300)
        .switchMap((term)=>this._questionsService.searchMyQuestions(term,self.userId))

        searchSource.subscribe(x=>{
            this.questions=x;
        })
    }

    getMyContent(){
        let self=this;
        let myCont=self._questionsService.getMyContent(this.userId)
        myCont.subscribe((x)=>{
            if(x && x.length>0){
                this.questions = x;
                self.addToLocalDB('myContent',self.questions);
            }
        },(err)=>{
            self.pouchInstance.get('myContent').then(function(doc) {
                  self.questions=doc.val;
            }).then(function(response) {
              
            }).catch(function (err) {
              console.log(err);
            });
        })
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
                     self.pouchInstance.put({_id:id,val:self.questions}).then(function (response) {
                        }).catch(function (err) {
                            console.log(err)
                        }); 

                  }
                });
                }
    }

};
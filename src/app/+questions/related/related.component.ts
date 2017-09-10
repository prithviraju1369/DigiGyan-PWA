import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params  } from '@angular/router';
import { tag,question } from './../../modal/profile';

import { QuestionsService }   from './../questions.service';

import { Subject } from 'rxjs/Subject';

import {MdSnackBar} from '@angular/material';

declare var PouchDB: any;

@Component({
    selector: 'related',
    templateUrl: './../questionsLayout.html',
    styleUrls:['./../questions.component.scss'],
    providers:[QuestionsService]
})
export class RelatedComponent implements OnInit {
	questions:question[];
    userId:any;
    private searchTermStream = new Subject<string>()
    pouchInstance:any;
    constructor(private router: Router,private _questionsService: QuestionsService,public snackbar:MdSnackBar) {
        this.userId=sessionStorage.getItem('username_id');
        this.pouchInstance=new PouchDB('DigiGyan');
        
    }

     search(terms: string) {
        this.searchTermStream.next(terms);
      }

    ngOnInit() {
        let self=this;
        this.getRelatedContent();
        const searchSource = this.searchTermStream
        .debounceTime(300)
        .switchMap((term)=>this._questionsService.searchRelated(term,self.userId))

        searchSource.subscribe(x=>{
            this.questions=x;
        })
    }

    addToLocalDB(id,val){
        if(val && val.length>0){
        let self=this;
        let msg='';
        self.pouchInstance.get(id).then(function(doc) {
                  return self.pouchInstance.put({
                    _id: id,
                    _rev: doc._rev,
                    val:val
                  });
                }).then(function(response) {
                  msg='Questions available offline';
                  self.snackbar.open(msg, 'Okay',{
                    duration: 2000,
                  });
                }).catch(function (err) {
                  if(err.status==404){
                     self.pouchInstance.put({_id:id,val:self.questions}).then(function (response) {
                          msg='Questions available offline';
                          self.snackbar.open(msg, 'Okay',{
                            duration: 2000,
                          });
                        }).catch(function (err) {
                            console.log(err)
                        }); 

                  }
                });
                }
    }

    getRelatedContent(){
        let self=this;
        let msg='';
        let relatedCont=self._questionsService.getRelatedContent(this.userId)
        relatedCont.subscribe((x)=>{
            if(x && x.length>0){
                self.questions = x;
                self.addToLocalDB('relatedContent',self.questions);

            }
        },(err)=>{
            self.pouchInstance.get('relatedContent').then(function(doc) {
              msg='Data from cache. Due to connectivity Issues';
                  self.snackbar.open(msg, 'Okay',{
                    duration: 3000,
                  });
                  self.questions=doc.val;
            }).then(function(response) {
              
            }).catch(function (err) {
              console.log(err);
            });
        })
    }


};
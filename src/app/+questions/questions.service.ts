import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { tag,question } from './../modal/profile';

@Injectable()
export class QuestionsService {

    constructor(private http: Http) {
        
    }

    getAllTags():Observable<any>{
        let result = this.http.get('/profileapi/alltags')
                .map((res: Response) => res.json())
                .map((x)=>{
                    return x.map(function(p){
                        p.selected=false;
                        return p;
                    });
                })
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

    addQuestion(question:question):Observable<any>{
    	let result = this.http.post(`/profileapi/addQuestion`,question)
	            .map((res: Response) => res.json())
	            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

    getRelatedContent(user:string){
        let params: URLSearchParams = new URLSearchParams();
        params.set('user', user);
        let requestOptions = new RequestOptions();
        requestOptions.search = params;
        let result = this.http.get('/profileapi/relatedContent',requestOptions)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

    getMyContent(user:string){
        let params: URLSearchParams = new URLSearchParams();
        params.set('user', user);
        let requestOptions = new RequestOptions();
        requestOptions.search = params;
        let result = this.http.get('/profileapi/myContent',requestOptions)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }
    searchRelated(term:string,user:string):Observable<any>{
        if(term.trim()!=''){
            return this.searchRelatedQuery(term,user);
        }else{
            return this.getRelatedContent(user);
        }
    }

    searchMyQuestions(term:string,user:string):Observable<any>{
        if(term.trim()!=''){
            return this.searchMyQuery(term,user);
        }else{
            return this.getMyContent(user);
        }
    }

    searchMyQuery(term:string,user:string):Observable<any>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('user', user);
        params.set('search', term);
        let requestOptions = new RequestOptions();
        requestOptions.search = params;
        let result = this.http.get('/profileapi/myContentSearch',requestOptions)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

    searchRelatedQuery(term:string,user:string):Observable<any>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('user', user);
        params.set('search', term);
        let requestOptions = new RequestOptions();
        requestOptions.search = params;
        let result = this.http.get('/profileapi/relatedContentSearch',requestOptions)
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

}
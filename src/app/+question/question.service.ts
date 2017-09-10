import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { tag,question } from './../modal/profile';

@Injectable()
export class QuestionService {

    constructor(private http: Http) {
        
    }

    getQuestion(id:string):Observable<any>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', id);
        let requestOptions = new RequestOptions();
        requestOptions.search = params;
	    let result = this.http.get('/profileapi/getQuestion',requestOptions)
	            .map((res: Response) => res.json())
	            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

    addComment(qId,user_id,comment):Observable<any>{
        let result = this.http.post('/profileapi/addComment',{qId:qId,user_id:user_id,comment:comment})
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

    addLike(qId:string,commentId:string,userId:string):Observable<any>{
        let result = this.http.post('/profileapi/addLike',{qId:qId,commentId:commentId,userId:userId})
                .map((res: Response) => res.json())
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

}
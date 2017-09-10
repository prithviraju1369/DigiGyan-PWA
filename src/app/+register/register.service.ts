import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { tag,profile } from './../modal/profile';

@Injectable()
export class RegisterService {

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

    register(user:profile):Observable<any>{
    	let result = this.http.post('/profileapi/register',user)
	            .map((res: Response) => res.json())
	            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

}
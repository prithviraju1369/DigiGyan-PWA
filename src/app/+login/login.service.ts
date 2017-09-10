import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { tag,profile } from './../modal/profile';

@Injectable()
export class LoginService {

    constructor(private http: Http) {
        
    }

    login(user:profile):Observable<any>{
    	let params: URLSearchParams = new URLSearchParams();
        params.set('username', user.username);
        params.set('password', user.password);

        let requestOptions = new RequestOptions();
        requestOptions.search = params;
    	let result = this.http.get(`/profileapi/login`,requestOptions)
	            .map((res: Response) => res.json())
	            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return result;
    }

}
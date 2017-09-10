import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { profile } from './../modal/profile';
import { LoginService }   from './login.service';

import {MdSnackBar} from '@angular/material';

@Component({
    selector: 'login',
    styleUrls:['./login.component.scss'],
    templateUrl: './login.component.html',
    providers:[LoginService]
})

export class LoginComponent implements OnInit {
	user:profile={};
    constructor(private router: Router,public snackbar:MdSnackBar,private _loginService: LoginService) {

    }

    ngOnInit() {
    }

    login(){
    	let self=this;
    	let msg='';
    	if(self.user){
    		if(!self.user.username || !self.user.password){
					msg='please fill the fields';
					self.snackbar.open(msg, 'Okay',{
				      duration: 2000,
				    });
				}else{
					let loginRes=self._loginService.login(self.user);
					loginRes.subscribe((x)=>{
						if(x && x.code==200){
							if(x.valMsg){
								self.snackbar.open(x.valMsg, 'Okay',{
							      duration: 2000,
							    });
							}else{
								self.snackbar.open(x.msg, 'Okay',{
							      duration: 2000,
							    });
							    sessionStorage.setItem('username_id', x.id);
							    self.router.navigate(['./questions']);
							}
						}
					})
				}
    	}

    }

};
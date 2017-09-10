import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tag,profile } from './../modal/profile';
import { Observable } from 'rxjs/Observable';
import { RegisterService } from './register.service';

import {MdSnackBar} from '@angular/material';

@Component({
    selector: 'register',
    styleUrls:['./register.component.scss'],
    templateUrl: './register.component.html',
    providers:[RegisterService]
})
export class RegisterComponent implements OnInit {
	user:profile={};
	tags:tag[]=[];
	config:any;
    constructor(private router: Router,private _registerService: RegisterService,public snackbar:MdSnackBar) {
    }	

    ngOnInit() {
    	this.getAllTags()
    }

    getAllTags(){
    	let self=this;
    	let tagsRes=this._registerService.getAllTags();
    	tagsRes.subscribe((x)=>{
    		if(x && x.length>0){
    			self.tags=x;
    		}
    	});
    }

    register(){
    	let self=this;
    	let msg='';
    	if(self.user){
    		self.user.tags=[];
    		let found = false;
			for(var i = 0; i < self.tags.length; i++) {
			    if (self.tags[i].selected) {
			        found = true;
		        	console.log(self.tags[i]);
			        self.user.tags.push(self.tags[i]._id);
			    }
			}
			if(!found){
				msg='select atleast one tag';
				self.snackbar.open(msg, 'Okay',{
			      duration: 2000,
			    });
			}else{
				if(!self.user.username || !self.user.password){
					msg='please fill the fields';
					self.snackbar.open(msg, 'Okay',{
				      duration: 2000,
				    });
				}else{
					let registerRes=self._registerService.register(this.user);
					registerRes.subscribe((x)=>{
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
							    self.router.navigate(['questions']);
							}
						}
					})
				}
			}

    	}
    }

};
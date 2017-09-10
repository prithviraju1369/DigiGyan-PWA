import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent }   from './login.component';

import { LoginService } from './login.service';


import {MaterialModule} from './../../material/material.module';

const routes: Routes = [
  { path: '', component: LoginComponent },
];

// login module bootstrapping
@NgModule({
    imports: [RouterModule.forChild(routes),
    		MaterialModule,
    		CommonModule,
    		FormsModule],
    declarations: [LoginComponent],
    providers:[LoginService]
})

export class LoginModule { }
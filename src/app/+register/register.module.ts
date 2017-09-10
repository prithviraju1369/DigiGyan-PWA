import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent }   from './register.component';

import { RegisterService } from './register.service';


import {MaterialModule} from './../../material/material.module';

const routes: Routes = [
  { path: '', component: RegisterComponent },
];

// register module bootstrapping
@NgModule({
    imports: [RouterModule.forChild(routes),
    		MaterialModule,
    		CommonModule,
    		FormsModule],
    declarations: [RegisterComponent],
    providers:[RegisterService]
})

export class RegisterModule { }
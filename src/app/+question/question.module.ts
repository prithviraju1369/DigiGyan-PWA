import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { QuestionComponent }   from './question.component';

import { QuestionService } from './question.service';


import {MaterialModule} from './../../material/material.module';

const routes: Routes = [
  { path: '', component: QuestionComponent },
];

// question module bootstrapping
@NgModule({
    imports: [RouterModule.forChild(routes),
    		MaterialModule,
    		CommonModule,
    		FormsModule],
    declarations: [QuestionComponent],
    providers:[QuestionService]
})

export class QuestionModule { }
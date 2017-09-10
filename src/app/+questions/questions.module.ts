import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { QuestionsComponent }   from './questions.component';
import { RelatedComponent }   from './related/related.component';
import { AskComponent }   from './ask/ask.component';
import { MyComponent }   from './my/my.component';

import { QuestionsService } from './questions.service';

import {MaterialModule} from './../../material/material.module';

const routes: Routes = [
  { path: '', component: QuestionsComponent }
];

// questions module bootstrapping
@NgModule({
    imports: [RouterModule.forChild(routes),FormsModule,CommonModule,MaterialModule],
    declarations: [QuestionsComponent,RelatedComponent,AskComponent,MyComponent],
    providers:[QuestionsService]
})
export class QuestionsModule {	
}
import { NgModule } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules } from '@angular/router';


const routes: Routes = [
 { path: '', redirectTo: '/index', pathMatch: 'full' },
 { path: 'login', loadChildren: './+login/login.module#LoginModule' },
 { path: 'register', loadChildren: './+register/register.module#RegisterModule' },
 { path: 'question/:id', loadChildren: './+question/question.module#QuestionModule' },
 { path: 'questions', loadChildren: './+questions/questions.module#QuestionsModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
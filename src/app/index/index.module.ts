import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { IndexComponent }   from './index.component';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
];

// index module bootstrapping
@NgModule({
    imports: [RouterModule.forChild(routes)],
    declarations: [IndexComponent]
})
export class IndexModule { }
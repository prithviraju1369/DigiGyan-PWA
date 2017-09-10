import { NgModule } from '@angular/core';
import {MdButtonModule, 
  MdCheckboxModule,
  MdToolbarModule,
  MdTabsModule,
  MdInputModule,
  MdSnackBarModule
} from '@angular/material';


@NgModule({
  imports: [
    MdButtonModule,MdCheckboxModule,MdToolbarModule,MdTabsModule,
    MdInputModule,MdSnackBarModule

  ],
  exports: [
    MdButtonModule,MdCheckboxModule,MdToolbarModule,MdTabsModule,
    MdInputModule,MdSnackBarModule
  ],
  providers: [],
})
export class MaterialModule { }
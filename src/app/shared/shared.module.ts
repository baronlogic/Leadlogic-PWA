import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from "@angular/flex-layout";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class SharedModule { }

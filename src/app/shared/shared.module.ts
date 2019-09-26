import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from "@angular/flex-layout";
import {BottomNavModule} from 'ngx-bottom-nav';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    BottomNavModule,
    ZXingScannerModule
  ],
  exports: [
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    BottomNavModule,
    ZXingScannerModule
  ]
})
export class SharedModule { }

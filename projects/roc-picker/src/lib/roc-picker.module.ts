import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BrowserModule } from '@angular/platform-browser';
import { DatepickerComponent } from './components/date-picker/date-picker.component';
import { NgModule } from '@angular/core';
import { RocPickerComponent } from './roc-picker.component';
import { RocdatePipe } from './pipes/rocdate.pipe';

import { RangePickerComponent } from './components/range-picker/range-picker.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    RocPickerComponent,
    RocdatePipe,
    RangePickerComponent,
    DatepickerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NzSelectModule,
    NzInputModule,
    NzIconModule
  ],
  exports: [
    RocPickerComponent,
    DatepickerComponent,
    RangePickerComponent
  ]
})
export class RocPickerModule { }

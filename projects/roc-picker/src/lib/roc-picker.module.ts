import { NgModule } from '@angular/core';
import { RocPickerComponent } from './roc-picker.component';
import { RocdatePipe } from './pipes/rocdate.pipe';



@NgModule({
  declarations: [
    RocPickerComponent,
    RocdatePipe
  ],
  imports: [
  ],
  exports: [RocPickerComponent]
})
export class RocPickerModule { }

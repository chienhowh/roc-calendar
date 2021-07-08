import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

export const RANGE_PICKER_CONTROL_VALUE_ACCESSOR = {
  // 將此視為表單控制項
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RangePickerComponent),
  multi: true
};
@Component({
  selector: 'lib-range-picker',
  templateUrl: './range-picker.component.html',
  styleUrls: ['./range-picker.component.scss'],
  providers: [RANGE_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class RangePickerComponent implements OnInit, ControlValueAccessor {

  /** 民國 or 西元(AD) */
  @Input() mode = 'ROC';
  /** 是否顯示民國字樣 */
  @Input() numberOnly = true;
  /** 西元顯示 */
  @Input() adType = 'y/MM/dd';

  /** 截止日(超過此日期不能選) */
  @Input() endDate = '2111/12/31';
  /** 起始年(此日期前不能選) */
  @Input() startDate = '1912/01/01';
  /** 顯示清除icon */
  @Input() showClear = true;
  /** 起日的時間 */
  firstDate;
  /** 迄日的時間 */
  secondDate;

  // Form Start
  /** 用來接收 setDisabledState 的狀態 */
  disabled = false;

  // 用來接收 registerOnChange 和 onTouched 傳入的方法
  onChange: (value) => {};
  onTouched: () => {};
  // Form End
  constructor(
  ) { }

  ngOnInit(): void {
  }

  // Form Start
  /** 從外部控制control值 */
  writeValue(dateGroup: any[]): void {
    if (dateGroup) {
      const firstDate = dateGroup[0];
      const secondDate = dateGroup[1];
      this.firstDate = firstDate;
      this.secondDate = secondDate;
      console.log('dateGroup', dateGroup);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onControlChange() {
    // moment(defined)會顯示今天，不能直接塞
    const firstDate = this.firstDate ? moment(this.firstDate).valueOf() : undefined;
    const secondDate = this.secondDate ? moment(this.secondDate).valueOf() : undefined;
    this.onChange([firstDate, secondDate]);
  }
  // Form End
  checkStart() {
    // 起日是否為截止日
    const firstIsEnd = moment(this.firstDate).diff(this.endDate, 'd') === 0;
    if (this.secondDate && this.firstDate >= this.secondDate) {
      if (firstIsEnd) {
        // 起日為截止日，則迄日不加一
        this.secondDate = this.firstDate;
      } else {
        this.secondDate = moment(this.firstDate).add(1, 'd').valueOf();
      }
    }
    this.onControlChange();
  }

  checkEnd() {
    const secondIsStart = moment(this.secondDate).diff(this.startDate, 'd') === 0;
    if (this.firstDate && this.secondDate <= this.firstDate) {
      if (secondIsStart) {
        this.firstDate = this.secondDate;
      }
      else {
        this.firstDate = moment(this.secondDate).subtract(1, 'd').valueOf();
      }
    }
    this.onControlChange();
  }
}

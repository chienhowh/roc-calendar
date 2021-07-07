import { Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment from 'moment';

import { NzSizeLDSType } from 'ng-zorro-antd/core/types';

export const DATEPICKER_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true
};

@Component({
  selector: 'lib-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [DATEPICKER_CONTROL_VALUE_ACCESSOR]
})
export class DatepickerComponent implements OnInit, ControlValueAccessor {
  /** template 顯示都用timestamp 操作 */
  /** 會拿到當天日期的起始時間 不是當下要注意 */
  @ViewChild('dates') dates: ElementRef;
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

  /** 傳入 placeholder */
  @Input() placeholder = '請選擇日期';
  /** 選單input尺寸 */
  @Input() mercSize: NzSizeLDSType;

  /** 顯示清除 icon */
  @Input() showClear = true;
  /** 今天日期 for moment 運算，不是最後選定日 */
  today;

  isROC;

  /** 選擇時間與起始日差距 */
  // diffTime = this.today.diff(this.today.clone().startOf('d'));
  present = moment().valueOf();

  // Form Start
  // 用來接收 setDisabledState 的狀態
  disabled = false;

  // 用來接收 registerOnChange 和 onTouched 傳入的方法
  onChange: (value) => {};
  onTouched: () => {};
  // Form End

  /** 日 */
  days = [];
  /** 年 */
  years = [];
  /** 月 */
  months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  /** 最後顯示日期 */
  selected_date: number | undefined;
  selected_year: number;
  selected_month: number;

  // 中文週
  weekZh = ['日', 'ㄧ', '二', '三', '四', '五', '六'];

  // 起迄日操作

  @HostListener('document:click', ['$event']) hideCaledar(event) {
    // 是否點擊顯示日期框
    const clickShowBox = this.eRef.nativeElement.contains(event.target);
    // 是否點擊下拉選單
    const clickSelect = event.target.className.includes
      ('ant-select-item');
    if (!clickShowBox && !clickSelect) {
      this.dates.nativeElement.classList.remove('active');
    }
  }

  constructor(
    private eRef: ElementRef
  ) { }
  ngOnInit(): void {
    console.log('init start');
    this.isROC = this.mode === 'ROC' ? 1911 : 0;
    this.yearCalendar();
    console.log('from init', this.selected_date);
  }


  // Form Setting Start
  /** 從外部控制control值 */
  writeValue(selectedDate: number): void {
    console.log('from ngmodel');

    // 如果沒選，則為當日
    if (selectedDate) {
      const startTime = moment(selectedDate).startOf('d').valueOf(); // 先轉換成當天時間最早值
      this.selected_date = startTime;
      this.today = moment(startTime);
      this.selected_year = moment(startTime).year() - this.isROC;
      this.selected_month = moment(startTime).month();
      console.log('from ngmodel');

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
    console.log(this.disabled);

  }

  // 元件內必須找一個時機觸發 change 方法
  controlChange() {
    console.log('from date change', this.selected_date);
    this.onChange(this.selected_date); // 把值送給外面的control
  }
  // Form Setting End

  // get finaltime() {
  //   // TODO: 最後送出記得加回時間差(看有沒有需要)
  //   return moment(this.selected_date + this.diffTime).format();
  // }
  // header start
  prevMth(event: Event): void {
    event.stopPropagation();
    const startYear = +this.startDate.slice(0, 4) - this.isROC;
    if (this.selected_month === 0) {
      if (this.selected_year === startYear) { return; }// 不能往前超出起始日
      this.selected_month = 11;
      this.selected_year -= 1;
    } else {
      this.selected_month -= 1;
    }
    this.today.subtract(1, 'M');
    this.datesCalendar();
  }

  nextMth(event: Event): void {
    event.stopPropagation();
    const endYear = +this.endDate.slice(0, 4) - this.isROC;
    if (this.selected_month === 11) {
      if (this.selected_year === endYear) { return; }// 不能超出截止日
      this.selected_month = 0;
      this.selected_year += 1;
    } else {
      this.selected_month += 1;
    }
    this.today.add(1, 'M');
    this.datesCalendar();
  }

  // header end
  toggleCalendar() {
    if (this.disabled) { return; }
    this.dates.nativeElement.classList.toggle('active'); // 顯示日歷
    this.datesCalendar();
  }

  /** 產生月曆日期 */
  datesCalendar() {
    // ngModel沒給值，就設今天
    if (!this.today) {
      this.today = moment().startOf('d');
      this.selected_year = this.today.year() - this.isROC;
      this.selected_month = this.today.month();
    }
    // 產生日期表
    const startDay = this.today.clone().startOf('month'); // 當月起始日期
    const endDay = this.today.clone().endOf('month').startOf('d'); // 當月終止日期
    const days = this.today.daysInMonth(); // 當月天數
    // days length 固定42
    this.days = [];
    // 加入前一個月的底，startDay.day()===當月第一天是星期幾
    for (let i = 0; i < startDay.day(); i++) {
      const date = startDay
        .clone()
        .subtract(startDay.day() - i, 'd')
        .valueOf();
      this.days.push(date);
    }
    // 當月日期
    for (let i = 0; i < days; i++) {
      const date = startDay.clone().add(i, 'd').valueOf();
      this.days.push(date);
    }
    // 加入後一個月的頭
    const lengthLeft = this.days.length;
    for (let i = 0; i < 42 - lengthLeft; i++) {
      const date = endDay
        .clone()
        .add(i + 1, 'd')
        .valueOf();
      this.days.push(date);
    }
  }

  /** 產生年份 */
  yearCalendar() {
    const startYear = +this.startDate.slice(0, 4);
    const endYear = +this.endDate.slice(0, 4);
    for (let i = startYear; i <= endYear; i++) {
      this.years.push(i - this.isROC); // 民國年記得扣掉
    }
  }


  /**
   * 是否在當月的日期，不是的話給他灰色字體
   * @param timestamp
   */
  presentMth(timestamp: number) {
    const todayMth = this.today.month();
    const mth = moment(timestamp).month();
    return mth === todayMth;
  }

  // 樣式相關 start
  /** 是否超出截止日，超出截止日給他灰底 */
  overEndDate(timestamp: number): boolean {
    const endDate = moment(this.endDate).endOf('d').valueOf();
    // console.log(endDate);
    return timestamp > endDate;
  }

  beforeStartDate(timestamp: number): boolean {
    const startDate = moment(this.startDate).startOf('d').valueOf();
    // console.log(startDate);
    return timestamp < startDate;
  }

  /** 產生選中藍色框框 */
  presentDate(timestamp: number) {
    const date = this.today.format('MM-DD-YYYY');
    const today = moment(timestamp).format('MM-DD-YYYY');
    return date === today;
  }
  // 樣式相關 end

  /**
   * 選取日期後，關閉日曆
   * @param timestamp 選取日期的timestamp
   * @param today 是否選取今天
   */
  selectDate(event: Event, timestamp: number, today = false) {
    event.stopPropagation();
    // 超出截止日，不能選
    if (this.overEndDate(timestamp) || this.beforeStartDate(timestamp)) {
      return;
    }
    // 非當前選擇月份，不能選
    const mth = moment(timestamp).month();
    if (mth !== this.selected_month && !today) {
      return;
    }
    this.selected_date = timestamp;
    this.today = moment(timestamp);
    this.selected_year = moment(timestamp).year() - this.isROC;
    this.selected_month = moment(timestamp).month();
    this.dates.nativeElement.classList.remove('active');
    // formcontrol value
    this.controlChange();
  }

  /** 選取年份，跳出該年份當月資訊 */
  selectYear(value: number) {
    const year = +value + this.isROC;
    const diffyear = this.today.year() - year;
    this.today.subtract(diffyear, 'year'); // 用this.today去操作
    this.selected_year = this.today.year() - this.isROC;
    this.datesCalendar();
  }

  selectMonth(value: number) {
    const month = +value;
    const diffmonth = this.today.month() - month;
    this.today.subtract(diffmonth, 'M');
    this.selected_month = this.today.month();
    this.datesCalendar();
  }

  /** 直接選今天 */
  selectToday(event: Event) {
    event.stopPropagation();
    const timestamp = moment().startOf('d').valueOf();
    console.log('selectToday', timestamp);
    this.selectDate(event, timestamp, true);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /** 清除全部 */
  clearAll() {
    this.selected_date = undefined; // 才能清空外面的表格
    this.today = moment().startOf('d');
    this.selected_year = this.today.year() - this.isROC;
    this.selected_month = this.today.month();
    this.dates.nativeElement.classList.remove('active');
    this.controlChange();
  }
}

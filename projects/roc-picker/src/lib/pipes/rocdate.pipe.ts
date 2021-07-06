import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'rocdate'
})
export class RocdatePipe implements PipeTransform {

  transform(timestamp: number | moment.Moment | undefined, mode: string, numberOnly: boolean): string | undefined {
    if (!timestamp) { return undefined; }
    // 年份處理
    const year = moment(timestamp).year() - 1911;
    // 月份處理
    const month = moment(timestamp).month() + 1;
    // 日期處理
    const date = moment(timestamp).date();
    if (!timestamp) { return `－`; }
    switch (mode) {
      case 'Y':
        if (numberOnly) {
          return `${year}`;
        } else {
          return `民國${year}年`;
        }
      case 'YM':
        if (numberOnly) {
          // 月份個位數要補0
          if (month <= 9) {
            return `${year}/0${month}`;
          } else {
            return `${year}/${month}`;
          }
        }
        return `民國${year}年${month}月`;
      case 'YMD':
        if (numberOnly) {
          // 月份個位數要補0
          return `${year}/${month <= 9 ? '0' + month : month}/${date <= 9 ? '0' + date : date}`;
        }
        return `民國${year} 年${month} 月${date} 日`;
      // 除錯
      default: return `－`;
    }
  }
}

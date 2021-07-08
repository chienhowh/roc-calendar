import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo';
  normal = '';
  // Range Picker Start
  dateGroup: number[] = [moment().valueOf(), moment('2022/01/01').valueOf()];

  /** 最大/最小日 */
  startDate = moment().subtract(10, 'y').format('YYYY/MM/DD');
  endDate = moment().add(30, 'd').format('YYYY/MM/DD');

  log(e) {
    console.log(e);
  }
}

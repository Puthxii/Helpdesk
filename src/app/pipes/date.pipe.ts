import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

moment.locale('th-TH')

@Pipe({
  name: 'datePipe'
})
export class DatePipe implements PipeTransform {

  transform(value: any, format: string): any {
    console.log('value ', value, 'format: ', format)
    // tslint:disable-next-line: curly
    if (!value) return moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')
    if (format) {
      return moment(new Date(value.seconds * 1000)).format(format)
    } else {
      return moment(new Date(value.seconds * 1000))
    }
  }

}

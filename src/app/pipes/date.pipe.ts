import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

moment.locale('th-TH')

@Pipe({
  name: 'datePipe'
})
export class DatePipe implements PipeTransform {

  transform(value: any, format: string): any {
    if (!value) {
      return null
    }

    if (format) {
      return moment(new Date(value.seconds * 1000)).format(format)
    } else {
      return moment(new Date(value.seconds * 1000))
    }
  }

}

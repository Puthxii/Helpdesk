import {Injectable } from "@angular/core";
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private redirectSource = new BehaviorSubject<string>('')
  currentRedirect = this.redirectSource.asObservable()

  constructor() {
  }

  changeRedirectSource(path: string) {
    this.redirectSource.next(path)
  }

}

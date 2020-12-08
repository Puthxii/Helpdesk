import { Component, ElementRef } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Helpdesk';

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
  }

  constructor(private elementRef: ElementRef) { }
  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#F2EDF3';
  }
}
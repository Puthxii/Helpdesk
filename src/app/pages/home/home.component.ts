import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../_alert/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  options = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  constructor(protected alertService: AlertService) { }

  ngOnInit() {
  }

}

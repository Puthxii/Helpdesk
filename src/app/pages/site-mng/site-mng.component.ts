import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-site-mng',
  templateUrl: './site-mng.component.html',
  styleUrls: ['./site-mng.component.css']
})
export class SiteMngComponent implements OnInit {
  id: string;

  constructor(
    public route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => this.id = params.id)
  }

  ngOnInit() {
  }

}

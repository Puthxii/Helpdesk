import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-site-mng',
  templateUrl: './site-mng.component.html',
  styleUrls: ['./site-mng.component.css']
})
export class SiteMngComponent implements OnInit {
  id: string;
  redirectPath: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private dataService: DataService,
  ) {
    this.route.params.subscribe(params => this.id = params.id)
    this.dataService.currentRedirect.subscribe(redirectPath => this.redirectPath = redirectPath)
  }

  ngOnInit() {
  }

  back() {
    this.router.navigate([`/${this.redirectPath}`]);
  }

}

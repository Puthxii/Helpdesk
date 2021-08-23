import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../_alert/alert.service';
import { TicketService } from 'src/app/services/ticket/ticket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  Dashboard = ['Draft', 'Informed', 'More Info', 'In Progress', 'Accepted', 'Assigned', 'Resolved']
  CountStatus = [0, 0, 0, 0, 0, 0, 0]
  seriesValue: number[];
  incomplete: number;
  informed: number;
  inProgress: number;
  resolved: number;
  total: number;

  constructor(
    protected alertService: AlertService,
    private ticketService: TicketService,
  ) {
  }

  ngOnInit() {
    this.getTicketByRole()
  }

  getTicketByRole() {
    for (let i = 0; this.Dashboard.length > i; i++) {
      this.ticketService.getCountByStatus(this.Dashboard[i]).subscribe(result => {
        this.CountStatus[i] = result.length;
        if (i === 6) {
          this.setSeries()
        }
      });

    }
  }

  setSeries() {
    this.incomplete = this.CountStatus[0] + this.CountStatus[2]
    this.informed = this.CountStatus[1]
    this.inProgress = this.CountStatus[3] + this.CountStatus[4] + this.CountStatus[5]
    this.resolved = this.CountStatus[6]
    this.total = this.CountStatus[0] +
      this.CountStatus[1] + this.CountStatus[2] +
      this.CountStatus[3] + this.CountStatus[4] +
      this.CountStatus[5] + this.CountStatus[6]
    this.seriesValue = [
      this.incomplete,
      this.informed,
      this.inProgress,
      this.resolved
    ]
  }

  percentage(value: number) {
    return (value / this.total * 100).toFixed(2)
  }

}

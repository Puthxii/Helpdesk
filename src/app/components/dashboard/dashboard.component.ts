import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/models/chart.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart', { static: true }) chart: ChartComponent;
  @Input() seriesValue: number[];
  public chartOptions: Partial<ChartOptions>;
  options = {
    autoClose: false,
    keepAfterRouteChange: false,
  };

  constructor() {
  }

  ngOnInit() {
    const total = this.seriesValue.reduce((a, b) => a + b, 0)
    this.chartOptions = {
      series: this.seriesValue,
      colors: ['#708090', '#FFCA67', '#3399CC', '#40E0D0'],
      chart: {
        type: 'donut',
        fontFamily: 'Nunito',
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '22px',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 600,
                color: undefined,
                offsetY: -10,
                formatter(val) {
                  return val
                }
              },
              total: {
                show: true,
                label: 'Total',
                color: 'black',
                formatter: () => `${total}`
              }
            }
          }
        }
      },
      labels: ['Incomplete', 'Informed', 'In Progress', 'Resolved'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    }

    const chart = new ApexCharts(document.querySelector('#chart'), this.chartOptions);
    chart.render();
  }

}

import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexPlotOptions
} from 'ng-apexcharts';

export interface ChartOptions {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: Array<string>;
    plotOptions: ApexPlotOptions
}
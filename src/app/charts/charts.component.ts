import { Component, ViewChild, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexAnnotations,
  ApexFill,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels: any;
  plotOptions: any;
  yaxis: any;
  xaxis: any;
  annotations: any;
  fill: any;
  stroke: any;
  grid: any;
  colors: any;
};

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  private data: any;

  constructor(private http: HttpClient) {
    // Initialize chartOptions with default values
    this.chartOptions = {
      series: [{
        name: 'Count',
        data: []  // default empty data
      }],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          distributed: true
        }
      },
      colors: ["#80c7fd", "#008FFB", "#80f1cb", "#00E396"],
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#000'] 
        }
       
      },
      stroke: {
        width: 2
      },
      grid: {
        row: {
          colors: ["#fff", "#f2f2f2"]
        }
      },
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: [],  // default empty categories
      },
      yaxis: {
        title: {
          text: "Count"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      },
      annotations: {
        points: []
      }
    };
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get('assets/data.json').subscribe((response: any) => {
      this.data = response.data;
      this.updateChart('student_count');
    });
  }

  updateChart(filter: string): void {
    let seriesData: any[] = [];
    let categories: string[] = [];

    if (filter === 'student_count') {
      seriesData = [this.data.student_count];
      categories = ['Student Count'];
    } else if (filter === 'gender') {
      seriesData = Object.values(this.data.gender);
      categories = Object.keys(this.data.gender);
    } else if (filter === 'institute_name') {
      seriesData = Object.values(this.data.institute_name);
      categories = Object.keys(this.data.institute_name);
    } else if (filter === 'pincode') {
      seriesData = Object.values(this.data.pincode);
      categories = Object.keys(this.data.pincode);
    }

    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        name: 'Count',
        data: seriesData
      }], 
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: categories
      }
    };
  }

  onFilterChange(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value;
    this.updateChart(filter);
  }
}
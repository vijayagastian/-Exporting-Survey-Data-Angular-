import { Component, ViewChild, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { saveAs } from 'file-saver';
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

  fill: any;
  stroke: any;
  grid: any;
};

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css']
})
export class CountComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  private data: any;  
  private currentFilter: string = 'both';

  constructor(private http: HttpClient) {
    this.chartOptions = {
      series: [{
        name: 'Surveys',
        data: [0, 0]
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
        categories: [],
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
    };
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http.get('assets/response.json').subscribe((response: any) => {
      this.data = response.data;
      this.updateChart(this.currentFilter);
    });
  }

  updateChart(filter: string): void {
    this.currentFilter = filter;

    let seriesData: any[] = [];
    let categories: string[] = [];

    if (filter === 'active') {
      seriesData = [this.data.surveys_active.count];
      categories = ['Active'];
    } else if (filter === 'inactive') {
      seriesData = [this.data.surveys_inactive.count];
      categories = ['Inactive'];
    } else if (filter === 'both') {
      seriesData = [this.data.surveys_active.count, this.data.surveys_inactive.count];
      categories = ['Active', 'Inactive'];
    }

    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        name: 'Surveys',
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

  downloadCSV(): void {
    let csvContent = "Type,Survey ID\n";

    if (this.currentFilter === 'active' || this.currentFilter === 'both') {
      this.data.surveys_active.survey_ids.forEach((id: number) => {
        csvContent += `Active,${id}\n`;
      });
    }

    if (this.currentFilter === 'inactive' || this.currentFilter === 'both') {
      this.data.surveys_inactive.survey_ids.forEach((id: number) => {
        csvContent += `Inactive,${id}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'survey_ids.csv');
  }
}
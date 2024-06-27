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
  annotations: any;
  fill: any;
  stroke: any;
  grid: any;
};

@Component({
  selector: 'app-surtaken',
  templateUrl: './surtaken.component.html',
  styleUrls: ['./surtaken.component.css']
})
export class SurtakenComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  private data: any;
  private currentFilter: string = 'survey_taken_count';

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
          distributed: true,
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
      annotations: {
        points: []
      }
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

    if (filter === 'survey_taken_count') {
      seriesData = Object.values(this.data.survey_taken).map((survey: any) => survey.count);
      categories = Object.keys(this.data.survey_taken);
    } else if (filter === 'survey_taken_students') {
      seriesData = Object.values(this.data.survey_taken).map((survey: any) => survey.student_ids.length);
      categories = Object.keys(this.data.survey_taken);
    } else if (filter === 'survey_taken_ids') {
      seriesData = Object.keys(this.data.survey_taken);
      categories = seriesData;
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
    let csvContent = "Survey ID,Count";

    // Find the maximum number of student IDs in any survey
    const maxStudentIds = Math.max(...Object.values(this.data.survey_taken).map((survey: any) => survey.student_ids.length));

    // Add headers for student IDs
    for (let i = 1; i <= maxStudentIds; i++) {
      csvContent += `,Student ID ${i}`;
    }
    csvContent += "\n";

    // Add survey data
    for (const [surveyId, surveyData] of Object.entries(this.data.survey_taken)) {
      const studentIds = (surveyData as any).student_ids;
      const row = [
        surveyId.split(": ")[1],
        (surveyData as any).count,
        ...studentIds,
        ...Array(maxStudentIds - studentIds.length).fill("") // Fill empty cells if student IDs are fewer than max
      ];
      csvContent += row.join(",") + "\n";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'survey_taken_data.csv');
  }
}
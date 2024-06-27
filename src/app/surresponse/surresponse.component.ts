import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-surresponse',
  templateUrl: './surresponse.component.html',
  styleUrls: ['./surresponse.component.css']
})
export class SurresponseComponent implements OnInit {

  surveys: any[] = []; // Dynamic survey IDs
  selectedSurveyId: any | null = null;
  selectedSurveyName: string = '';
  jsonData: any;
  chartOptions: any;
  noCountMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSurveys();
    this.initializeChart();
  }

  fetchSurveys() {
    this.http.get<any>('assets/full_response.json').subscribe(response => {
      if (response.api_status) {
        this.surveys = response.data;
        if (this.surveys.length > 0) {
          this.selectedSurveyId = this.surveys[0].Survey_id;
          this.fetchSurveyData(this.selectedSurveyId);
        }
      }
    });
  }

  onSurveyChange(event: Event) {
    const surveyId = +(event.target as HTMLSelectElement).value;
    this.fetchSurveyData(surveyId);
  }

  fetchSurveyData(surveyId: number) {
    this.http.get<any>('assets/full_response.json').subscribe(response => {
      if (response.api_status) {
        this.jsonData = response.data.find((survey: any) => survey.Survey_id === surveyId);
        this.selectedSurveyName = this.jsonData ? this.jsonData.survey_name : 'N/A';
        this.updateChart();
      }
    });
  }

  initializeChart() {
    this.chartOptions = {
      series: [{
        name: 'Responses',
        data: []
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        title: {
          text: 'Count'
        }
      },
      fill: {
        opacity: 1
      }
    };
  }

  updateChart() {
    if (this.jsonData) {
      if (this.jsonData.Count === 0) {
        this.noCountMessage = 'No count';
        this.chartOptions.series = [{
          name: 'Responses',
          data: []
        }];
        this.chartOptions.xaxis = {
          categories: []
        };
      } else {
        this.noCountMessage = '';
        this.chartOptions.series = [{
          name: 'Responses',
          data: [this.jsonData.Count]
        }];
        this.chartOptions.xaxis = {
          categories: [this.selectedSurveyName]
        };
      }
    }
  }

  exportToPdf() {
    if (!this.jsonData || !this.jsonData.Survey_response.length) {
      return;
    }

    const doc = new jsPDF();
    doc.text(`${this.selectedSurveyName} Responses`, 10, 10);

    const rows = this.jsonData.Survey_response.map((response: any) => {
      return response.responses.map((r: any) => [
        response.reg_id,
        r.question_name,
        r.choice_taken
      ]);
    }).flat();

    (doc as any).autoTable({
      head: [['Student ID', 'Question', 'Answer']],
      body: rows
    });

    doc.save(`${this.selectedSurveyName}_responses.pdf`);
  }

  exportToCSV() {
    if (!this.jsonData || !this.jsonData.Survey_response.length) {
      return;
    }

    const csvData = this.jsonData.Survey_response.map((response: any) => {
      const studentId = response.reg_id;
      const responses = response.responses.map((r: any) => `${r.question_name},${r.choice_taken}`).join('\n');
      return { studentId, responses };
    });

    let csvContent = 'Student ID,Question,Answer\n';
    csvData.forEach((row: any) => {
      const responses = row.responses.split('\n').map((resp: string) => `${row.studentId},${resp}`).join('\n');
      csvContent += `${responses}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, `${this.selectedSurveyName}_responses.csv`);
  }

  exportToExcel() {
    if (!this.jsonData || !this.jsonData.Survey_response.length) {
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.jsonData.Survey_response.flatMap((response: any) => {
        return response.responses.map((r: any) => ({
          'Student ID': response.reg_id,
          Question: r.question_name,
          Answer: r.choice_taken
        }));
      })
    );

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `${this.selectedSurveyName}_responses.xlsx`);
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface Question {
  question_id: number;
  question: string;
  choice_: string[];
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  jsonData: Question[] = [];
  filteredData: Question[] = []; 
  surveys = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]; 
  selectedSurveyId: number | null = null;
  selectedSurveyName: string = '';
  searchQuery: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
   
    this.fetchSurveyData(1);
  }

  onSurveyChange(event: Event) {
    const surveyId = +(event.target as HTMLSelectElement).value;
    this.fetchSurveyData(surveyId);
  }

  fetchSurveyData(surveyId: number) {
    this.http.get<any>(`assets/survey_${surveyId}.json`).subscribe(response => {
      if (response.api_status) {
        this.jsonData = response.data;
        this.filteredData = this.jsonData; 
        this.selectedSurveyName = response["survey name"]; 
      }
    });
  }

  getChoiceLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  exportCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `Survey ID,${this.selectedSurveyId}\n`;
    csvContent += `Survey Name,${this.selectedSurveyName}\n\n`;

    this.filteredData.forEach((question, i) => {
      csvContent += `Question ${i + 1},${question.question}\n`;
      question.choice_.forEach((choice, j) => {
        csvContent += `${this.getChoiceLetter(j)}. ${choice}\n`;
      });
      csvContent += '\n'; 
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `survey_${this.selectedSurveyId}_data.csv`);
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
  }

  exportPDF() {
    const doc = new jsPDF();
    let y = 10;

    doc.text(`Survey ID: ${this.selectedSurveyId}`, 10, y);
    y += 10;
    doc.text(`Survey Name: ${this.selectedSurveyName}`, 10, y);
    y += 10;

    this.filteredData.forEach((question, i) => {
      y += 10;
      doc.text(`Question ${i + 1}: ${question.question}`, 10, y);
      question.choice_.forEach((choice, j) => {
        y += 10;
        doc.text(`${this.getChoiceLetter(j)}. ${choice}`, 20, y);
      });
    });

    doc.save(`survey_${this.selectedSurveyId}_data.pdf`);
  }

  exportExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredData.map((q, i) => {
      let choices: any = {};
      q.choice_.forEach((choice, j) => {
        choices[`Choice ${this.getChoiceLetter(j)}`] = choice;
      });
      return {
        Question: `Question ${i + 1}: ${q.question}`,
        ...choices
      };
    }));

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, `survey_${this.selectedSurveyId}_data`);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    saveAs(data, `${fileName}.xlsx`);
  }

  onSearchChange() {
    const query = this.searchQuery.toLowerCase();
    this.filteredData = this.jsonData.filter(question =>
      question.question.toLowerCase().includes(query) ||
      question.choice_.some(choice => choice.toLowerCase().includes(query))
    );
  }
}

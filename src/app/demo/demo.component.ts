import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  surveyData: any;
  private apiUrl = 'assets/quesresponse.json'; 

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSurveyData();
  }

  fetchSurveyData(): void {
    this.http.get<any>(this.apiUrl).subscribe(
      data => {
        console.log('Fetched data:', data);
        this.surveyData = data;

        if (this.surveyData && Array.isArray(this.surveyData.data)) {
          this.surveyData.data.forEach((question: any) => {
            question.isExpanded = false;
          });
        } else {
          console.error('surveyData.data is not an array:', this.surveyData.data);
        }
      },
      error => {
        console.error('Error fetching survey data:', error);
      }
    );
  }

  expandAllPanels(): void {
    if (Array.isArray(this.surveyData?.data)) {
      this.surveyData.data.forEach((question: any) => {
        question.isExpanded = true;
      });
    }
  }

  collapseAllPanels(): void {
    if (Array.isArray(this.surveyData?.data)) {
      this.surveyData.data.forEach((question: any) => {
        question.isExpanded = false;
      });
    }
  }


  exportToPDF(): void {
    if (!this.surveyData || !Array.isArray(this.surveyData.data)) {
      console.error('No data available for PDF generation');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    let yOffset = 20;
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 4;
    const lineHeight = 10;
    const textMargin = 15;
    const symbolOffset = 7;
    const symbolSize = 3;
    let pageNumber = 1;

    const addPageNumber = () => {
      doc.setFontSize(10);
      doc.text(`Page ${pageNumber}`, pageWidth / 2, 290, { align: 'center' });
      pageNumber++;
    };

    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 4 * margin);

    doc.setFont('Times New Roman');
    doc.setFontSize(16);
    doc.text('Survey: ' + this.surveyData.survey_name, margin, yOffset);
    yOffset += lineHeight;
    doc.setFontSize(10);
    doc.text('Start Date: ' + this.surveyData.start_date, margin, yOffset);
    doc.text('End Date: ' + this.surveyData.end_date, margin + 100, yOffset);

    yOffset += lineHeight * 2;

    addPageNumber();
    this.surveyData.data.forEach((question: any, index: number) => {
      doc.setFontSize(14);
      doc.text('  '+(index + 1) + '. ' + question.qp_text + ' (' + question.qp_type_name + ')', margin, yOffset);
      yOffset += lineHeight;
      doc.setFontSize(12);

      if (question.contain_choices && Array.isArray(question.choices)) {
        question.choices.forEach((choice: any) => {
          const symbolX = margin + textMargin - symbolOffset;
          const symbolY = yOffset - 2;

          if (question.qp_type_name === 'MCQ') {
            doc.circle(symbolX, symbolY, symbolSize / 2);
          } else if (question.qp_type_name === 'CHECKBOX') {
            doc.rect(symbolX - symbolSize / 2, symbolY - symbolSize / 2, symbolSize, symbolSize);
          }

          doc.text(choice.choice_text, margin + textMargin, yOffset);
          yOffset += lineHeight;
        });
      }
      yOffset += textMargin;

      if (yOffset > 280) {
        addPageNumber();
        doc.addPage();
        yOffset = margin;
      }
    });

    addPageNumber();
    doc.save('surveydata.pdf');
  }
}
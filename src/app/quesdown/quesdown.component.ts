import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-quesdown',
  templateUrl: './quesdown.component.html',
  styleUrls: ['./quesdown.component.css']
})
export class QuesdownComponent implements OnInit, AfterViewInit {
  surveyData: any;
  @ViewChild('printableContent') printableContent!: ElementRef;
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  private apiUrl = 'assets/quesresponse.json';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSurveyData();
  }

  ngAfterViewInit(): void {

  }

  fetchSurveyData(): void {
    this.http.get<any>(this.apiUrl).subscribe(
      data => {
        this.surveyData = data;
        this.surveyData.data.forEach((question: any) => {
          question.isExpanded = false;
        });
      },
      error => {
        console.error('Error fetching survey data:', error);
      }
    );
  }

  expandAllPanels(): void {
    this.surveyData.data.forEach((question: any) => {
      question.isExpanded = true;
    });
  }

  collapseAllPanels(): void {
    this.surveyData.data.forEach((question: any) => {
      question.isExpanded = false;
    });
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
  

    const addPageNumber = () => {
      doc.setFontSize(10);
    
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

    
    });


    doc.save('surveydata.pdf');
  }
}
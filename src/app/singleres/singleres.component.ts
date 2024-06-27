import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { single } from 'rxjs';
import * as XLSX from 'xlsx';

interface QuestionData {
  'Question ID': string;
  'Question Name': string;
  'Choices': string;
  'Choice Taken': string;
}

@Component({
  selector: 'app-singleres',
  templateUrl: './singleres.component.html',
  styleUrls: ['./singleres.component.css']
})
export class SingleresComponent {
 
  registerId: string = '';
  regName: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<SingleresComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  fetchRegName(): void {
    const survey = this.data.survey;
    const surveyResponse = survey.Survey_response.find((response: any) => response.reg_id === this.registerId);
    if (surveyResponse) {
      this.regName = surveyResponse.reg_name;
    } else {
      this.regName = undefined;
      alert(`Register ID '${this.registerId}' not found in selected survey.`);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDownload(): void {
    if (this.regName) {
      this.exportToExcel();
    } else {
      alert('Please fetch Register Name before downloading.');
    }
  }

  exportToExcel(): void {
    const surveyId = this.data.survey.Survey_id;
    const surveyResponses = this.data.survey.Survey_response.filter((response: any) => response.reg_id === this.registerId);


    const excelData: any[] = [];

  
    excelData.push({
      'Register ID': this.registerId,
      'Register Name': this.regName
    });

    const questionMap: { [key: string]: QuestionData } = {};

   
    surveyResponses.forEach((response: any) => {
      response.responses.forEach((res: any) => {
        const questionId = res.question_id;
        const questionName = res.question_name;
        const choices = res.choices ? res.choices.map((choice: { choice_text: string }) => choice.choice_text).join(', ') : '';
        const choiceTaken = res.choice_taken;

        if (questionMap[questionId]) {
         
          questionMap[questionId]['Choices'] += `, ${choices}`;
          questionMap[questionId]['Choice Taken'] += `, ${choiceTaken}`;
        } else {
          
          questionMap[questionId] = {
            'Question ID': questionId,
            'Question Name': questionName,
            'Choices': choices,
            'Choice Taken': choiceTaken
          };
        }
      });
    });

    
    Object.values(questionMap).forEach((questionData: QuestionData) => {
      excelData.push(questionData);
    });

  
    const worksheet = XLSX.utils.json_to_sheet(excelData);


    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');

    const wscols = [
      { wch: 15 }, // Register ID
      { wch: 25 }, // Register Name
      { wch: 15 }, // Question ID
      { wch: 50 }, // Question Name
      { wch: 50 }, // Choices
      { wch: 50 }  // Choice Taken
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `survey_${surveyId}_response_${this.registerId}.xlsx`);

    this.dialogRef.close();
  }
}
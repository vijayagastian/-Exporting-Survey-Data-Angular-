import { Component, OnInit } from '@angular/core';
import { SingleresComponent } from '../singleres/singleres.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit {
  surveys: any[] = [];
  selectedSurvey: any = null;

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchSurveys();
  }

  fetchSurveys(): void {
    this.http.get<any>('assets/bulk.json').subscribe(data => {
      if (data.api_status) {
        this.surveys = data.data;
      }
    });
  }

  onSurveyChange(event: any): void {
    const surveyId = +event.target.value;
    this.selectedSurvey = this.surveys.find(survey => survey.Survey_id === surveyId);
  }

  openDialog(): void {
    if (!this.selectedSurvey) {
      alert('Please select a survey first.');
      return;
    }

    const dialogRef = this.dialog.open(SingleresComponent, {
      width: '400px',
      height: '300px',
      data: { survey: this.selectedSurvey }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.registerId) {
        // Handle download action with result.registerId
        console.log('Download triggered with Register ID:', result.registerId);
      }
    });
  }

  downloadBulkResponse(): void {
    if (!this.selectedSurvey) {
        alert('Please select a survey first.');
        return;
    }

    const surveyId = this.selectedSurvey.Survey_id;
    const surveyResponses = this.selectedSurvey.Survey_response;

    if (surveyResponses.length > 0) {
        const csvData : any = [];

        surveyResponses.forEach((resp: { reg_id: string; reg_name: string; responses: any[]; }) => {
            // Add register_id and register_name row
            csvData.push({
                register_id: resp.reg_id,
                register_name: resp.reg_name,
                question_id:'',
                question: '',
                choices: '',
                choice_taken: ''
            });

            // Aggregate responses for the same question
            const aggregatedResponses: { [key: string]: { question_id: string , question: string, choices: string, choice_taken: string[] } } = {};
            resp.responses.forEach(res => {
              const questionid=res.question_id;
                const questionKey = res.question_name;
                const choices = res.choices ? res.choices.map((choice: { choice_text: string }) => choice.choice_text).join(', ') : '';
                const choiceTaken = res.choice_taken;

                if (!aggregatedResponses[questionKey]) {
                    aggregatedResponses[questionKey] = {
                      question_id:res.question_id,
                        question: res.question_name,
                        choices: choices,
                        choice_taken: [choiceTaken]
                    };
                } else {
                    aggregatedResponses[questionKey].choice_taken.push(choiceTaken);
                }
            });

            // Add each aggregated response to csvData
            Object.values(aggregatedResponses).forEach(aggRes => {
                csvData.push({
                    register_id: '',
                    register_name: '',
                    question_id: aggRes.question_id,
                    question: aggRes.question,
                    choices: aggRes.choices,
                    choice_taken: aggRes.choice_taken.join(', ')
                });
            });
        });

        this.exportToCsv(`survey_${surveyId}_bulk_responses.xlsx`, csvData);
    } else {
        alert("No responses available for this survey.");
    }
}


downloadQuestions(): void {
  if (!this.selectedSurvey) {
    alert('Please select a survey first.');
    return;
  }

  const surveyId = this.selectedSurvey.Survey_id;
  const surveyName = this.selectedSurvey.survey_name;
  const surveyResponses = this.selectedSurvey.Survey_response;

  if (surveyResponses.length > 0) {
    // Prepare data for Excel export
    const excelData: any[] = [];

    // Add Survey ID and Survey Name as row 1
    excelData.push({
      'Survey ID': 'Survey ID',
      'Survey Name': 'Survey Name'
    });

    // Add actual Survey ID and Survey Name data
    excelData.push({
      'Survey ID': surveyId,
      'Survey Name': surveyName
    });

    // Add headers for question details
    excelData.push({
     
      'Question ID': 'Question ID',
      'Question Name': 'Question Name',
      'Choices': 'Choices'
    });

    // Aggregate questions and choices
    const questionMap: { [key: string]: { question_id: string, question_name: string, choices: Set<string> } } = {};
    surveyResponses.forEach((response: { responses: any[]; }) => {
      response.responses.forEach(res => {
        if (!questionMap[res.question_name]) {
          questionMap[res.question_name] = {
            question_id: res.question_id,
            question_name: res.question_name,
            choices: new Set<string>()
          };
        }
        if (res.choices) {
          res.choices.forEach((choice: { choice_text: string }) => questionMap[res.question_name].choices.add(choice.choice_text));
        }
      });
    });

    // Add questions and choices data
    let questionNumber = 1;
    Object.values(questionMap).forEach((q, index) => {
      excelData.push({
       
        'Question ID': q.question_id,
        'Question Name': q.question_name,
        'Choices': Array.from(q.choices).join(', ')
      });
      questionNumber++;
    });

    // Convert excelData to worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData, { skipHeader: true });

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions');

    // Set column widths (optional)
    const wscols = [
      {wch:20},
      {wch:25},
     
      { wch: 15 }, // Question ID
      { wch: 50 }, // Question Name
      { wch: 50 }  // Choices
    ];
    worksheet['!cols'] = wscols;

    // Export the Excel file
    XLSX.writeFile(workbook, `survey_${surveyId}_questions.xlsx`);
  } else {
    alert("No responses available for this survey.");
  }
}

  exportToCsv(filename: string, data: any[]): void {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: ['register_id', 'register_name','question_id', 'question', 'choices', 'choice_taken'] });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Responses');

    // Set column widths
    const wscols = [
        { wch: 15 }, // register_id
        { wch: 20 }, // register_name
        { wch: 15 }, // question-id
        {wch:50},
        { wch: 50 }, // choices
        { wch: 50 }  // choice_taken
        
    ];
    worksheet['!cols'] = wscols;


    XLSX.writeFile(workbook, filename);
}

convertToCsv(data: any[]): string {
    const headers = ['register_id', 'register_name' ];
    const csvRows = [headers.join(',')];

    data.forEach(row => {
        const values = headers.map(header => {
            let cell = row[header] === null || row[header] === undefined ? '' : row[header];
            cell = typeof cell === 'string' ? cell.replace(/"/g, '""') : cell;
            if (typeof cell === 'string' && cell.includes(',')) {
                cell = `"${cell}"`;
            }
            return cell;
        });
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
}
}
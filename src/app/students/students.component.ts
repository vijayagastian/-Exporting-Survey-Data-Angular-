import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { SingleDialogComponent } from '../single-dialog/single-dialog.component';

interface Institute {
  institute_Code: number;
  institute_Name: string;
  Stu_data: {
    'student id': number;
    name: string;
    Gender: string;
    PH_no: number;
    Graduation: string;
    Stream: string;
    Address: string;
    Pincode: number;
    State: string;
  }[];
}

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  institutes: Institute[] = [];
  selectedInstitute: Institute | undefined;
  selectedInstituteName: string = '';

  constructor(public dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInstitutes();
  }

  loadInstitutes(): void {
    this.http.get<any>('assets/student.json').subscribe(
      data => {
        if (data.api_status && data.data) {
          this.institutes = data.data;
        } else {
          console.error('Failed to retrieve institute data.');
        }
      },
      error => {
        console.error('Error fetching institute data:', error);
      }
    );
  }

  onInstituteChange(): void {
    this.selectedInstitute = this.institutes.find(
      institute => institute.institute_Name === this.selectedInstituteName
    );
  }

  openSingleDialog(): void {
    if (!this.selectedInstitute) {
      console.error('No institute selected.');
      return;
    }

    const dialogRef = this.dialog.open(SingleDialogComponent, {
      width: '350px',
      data: { institute: this.selectedInstitute }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.studentId && result.studentName) {
        this.downloadSingle(result.studentId, result.studentName);
      }
    });
  }
  downloadSingle(studentId: any, studentName: any) {
    throw new Error('Method not implemented.');
  }

  downloadBulk() {
    if (!this.selectedInstitute) {
      console.error('Selected institute is undefined.');
      return;
    }

    // Prepare headers and data for bulk download
    const headers = [
      ['Institute Code', this.selectedInstitute.institute_Code],
      ['Institute Name', this.selectedInstitute.institute_Name],
      ['Student ID', 'Student Name', 'Gender', 'Phone Number', 'Graduation', 'Stream', 'Address', 'Pincode', 'State']
    ];

    const data = this.selectedInstitute.Stu_data.map(student => [
      student['student id'],
      student.name,
      student.Gender,
      student.PH_no,
      student.Graduation,
      student.Stream,
      student.Address,
      student.Pincode,
      student.State
    ]);

    // Create a new workbook and worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student Data');

    // Adjust column widths (optional)
    const wscols = [
      { wch: 15 }, // Student ID
      { wch: 20 }, // Student Name
      { wch: 10 }, // Gender
      { wch: 15 }, // Phone Number
      { wch: 15 }, // Graduation
      { wch: 15 }, // Stream
      { wch: 30 }, // Address
      { wch: 10 }, // Pincode
      { wch: 15 }  // State
    ];
    ws['!cols'] = wscols;

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, `${this.selectedInstitute.institute_Name}_Data.xlsx`);
  }
}

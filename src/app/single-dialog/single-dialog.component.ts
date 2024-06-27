import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

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
  selector: 'app-single-dialog',
  templateUrl: './single-dialog.component.html',
  styleUrls: ['./single-dialog.component.css']
})
export class SingleDialogComponent {
  studentName: string | undefined;
  studentId: number | undefined; 

  constructor(
    public dialogRef: MatDialogRef<SingleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { institute: Institute }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  fetchStudentName(): void {
    const student = this.data.institute.Stu_data.find((s) => s['student id'] === this.studentId);
    if (student) {
      this.studentName = student.name;
    } else {
      this.studentName = 'Student  Id not found';
    }
  }
  downloadData(): void {
    const institute = this.data.institute;
    const student = institute.Stu_data.find((s) => s['student id'] === this.studentId);

    if (student) {
     
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      
        [`Institute Code: ${institute.institute_Code}`, `Institute Name: ${institute.institute_Name}`],
        
        [`Student ID: ${student['student id']}`, `Student Name: ${student.name}`],
       
        ['Gender', 'Phone Number', 'Graduation', 'Stream', 'Address', 'Pincode', 'State'],
      
        [
          student.Gender,
          student.PH_no.toString(),
          student.Graduation,
          student.Stream,
          student.Address,
          student.Pincode.toString(),
          student.State
        ]
      ]);

    
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Student Data');

   
      const wscols = [
        { wch: 20 }, 
        { wch: 20 }, 
        { wch: 15 }, 
        { wch: 20 }, 
        { wch: 10 },
        { wch: 15 }, 
        { wch: 15 }, 
        { wch: 15 }, 
        { wch: 30 }, 
        { wch: 10 }, 
        { wch: 15 }  
      ];

      ws['!cols'] = wscols;

      
      XLSX.writeFile(wb, `${student.name}_Data.xlsx`);
    }

    this.dialogRef.close();
  }
}
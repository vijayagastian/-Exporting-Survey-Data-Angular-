import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { MatSelectChange } from '@angular/material/select';

interface Spoc {
  spoc_id: number;
  Name: string;
  Emp_id:number;
  'e-mail': string;
  dob: string;
  'Ph.no': number;
  Designation: string;
  Address: string;
}

interface InstituteData {
  institute_Name: string;
  institute_Code: string;
  Spoc: Spoc[];
}

@Component({
  selector: 'app-spoc',
  templateUrl: './spoc.component.html',
  styleUrls:['./spoc.component.css']
})
export class SpocComponent implements OnInit {
  institutes: InstituteData[] = [];
  selectedInstitute: InstituteData | null = null;
  alertMessage: string = '';
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<any>('assets/spoc.json').subscribe(response => {
      if (response.api_status) {
        this.institutes = response.data;
      }
    });
  }

 
  onInstituteSelect(event: Event) {
    const selectedInstituteName = (event.target as HTMLSelectElement).value;
    this.selectedInstitute = this.institutes.find(institute => institute.institute_Name === selectedInstituteName) || null;
  }

  downloadData() {
    if (!this.selectedInstitute) return;

    if (this.selectedInstitute.Spoc.length === 0) {
      alert('No SPOC data available for this institute.') ;
      return;
    } else {
      this.alertMessage = '';
    }

    const ws_data = [
      ['Institute Name', this.selectedInstitute.institute_Name],
      ['Institute Code', this.selectedInstitute.institute_Code],
      [],
      ['Spoc ID', 'Name', 'Emp_id','Email', 'DOB', 'Phone Number', 'Designation', 'Address'],
      ...this.selectedInstitute.Spoc.map(spoc => [
        spoc.spoc_id,
        spoc.Name,
        spoc.Emp_id,
        spoc['e-mail'],
        spoc.dob,
        spoc['Ph.no'],
        spoc.Designation,
        spoc.Address
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Spoc ID
      { wch: 20 }, // Name
      {wch:20},
      { wch: 25 }, // Email
      { wch: 10 }, // DOB
      { wch: 15 }, // Phone Number
      { wch: 20 }, // Designation
      { wch: 30 }  // Address
    ];
    ws['!cols'] = columnWidths;

    // Set styles
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) continue;
        ws[cell_ref].s = {
          alignment: { horizontal: 'center', vertical: 'center' },
          font: { bold: R < 2 }  // Bold for first two rows
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Institute Data');

    XLSX.writeFile(wb, `${this.selectedInstitute.institute_Name}.xlsx`);
  }
}
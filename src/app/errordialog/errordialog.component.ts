import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-errordialog',
  templateUrl: './errordialog.component.html',
  styleUrl: './errordialog.component.css'
})
export class ErrordialogComponent {

  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<ErrordialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.errorMessage = data.errorMessage;
  }

  close(): void {
    this.dialogRef.close();
  }
}

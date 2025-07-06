import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, FormsModule, CommonModule],
  templateUrl: './app-dialog.component.html',
  styleUrl: './app-dialog.component.css'
})
export class AppDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

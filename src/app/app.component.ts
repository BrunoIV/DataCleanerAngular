import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RibbonMenuComponent } from './components/ribbon-menu/ribbon-menu.component';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, AgGridModule, RibbonMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private http: HttpClient) {
    this.getData();
  }

  
  columnDefs: ColDef[] = [];

  // Datos de las filas
  rowData : any[] = [];

  onCellValueChanged(event: any) {
    console.log('Cell value changed', event);

  }

  handleButtonClick(buttonId: string): void {
    console.log(`Button clicked: ${buttonId}`);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (event: any) => {
      this.onFileSelected(event);
      document.body.removeChild(fileInput);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
  }

  getData(): void {
    this.http.get<any>('http://localhost:8080/getExampleData').subscribe((response) => {
      this.columnDefs = response.header;
      this.rowData = response.values;
    });
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);

    const upload$ = this.http.post('http://localhost:8080/upload', formData);

    upload$.subscribe({
      next: (response: any) => {
        console.log(response);
        this.columnDefs = response.header;
      this.rowData = response.values;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}

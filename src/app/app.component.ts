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
    if(buttonId.startsWith('import_')) {
      this.selectFile(buttonId.replace('import_', ''));
    } else {
      alert(buttonId + ' Not implemented');
    }
  }

  selectFile(format :string) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.accept = '.' + format;

    fileInput.addEventListener('change', (event: any) => {
      const selectedFile = event.target.files[0];

      // Check if the selected file is a CSV file
     // if (selectedFile && selectedFile.type === 'text/' + format) {
        
        this.onFileSelected(event, format);
        document.body.removeChild(fileInput);
    
    });

    document.body.appendChild(fileInput);
    fileInput.click();
  }

  getData(): void {
    this.http.get<any>('http://localhost:8080/import/getExampleData').subscribe((response) => {
      this.columnDefs = response.header;
      this.rowData = response.values;
    });
  }

  onFileSelected(event: any, format :string) {
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);

    const upload$ = this.http.post('http://localhost:8080/import/' + format, formData);

    upload$.subscribe({
      next: (response: any) => {
        this.columnDefs = response.header;
        this.rowData = response.values;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}

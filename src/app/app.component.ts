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
    alert(`Button clicked: ${buttonId}`);
  }

  getData(): void {
    this.http.get<any>('http://localhost:8080/getExampleData').subscribe((response) => {
      this.columnDefs = response.header;
      this.rowData = response.values;
    });
  }
}

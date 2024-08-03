import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RibbonMenuComponent } from './components/ribbon-menu/ribbon-menu.component';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AgGridModule, RibbonMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  columnDefs: ColDef[] = [
    { headerName: 'Make', field: 'make', editable: true },
    { headerName: 'Model', field: 'model', editable: true },
    { headerName: 'Price', field: 'price', editable: true }
  ];

  // Datos de las filas
  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 }
  ];

  onCellValueChanged(event: any) {
    console.log('Cell value changed', event);
  }

  handleButtonClick(buttonId: string): void {
    alert(`Button clicked: ${buttonId}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'data-grid',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.css'
})
export class DataGridComponent {

  //Grid config
  columnDefs: ColDef[] = [];
  rowData : any[] = [];
  defaultColDef = {
    sortable: true,
    filter: true
  };

  gridOptions = {
    animateRows: true,
    onRowDragEnd: (event: any) => {
        const movingData = event.node.data;
        const overData = event.overNode.data;
        const fromIndex = this.rowData.indexOf(movingData);
        const toIndex = this.rowData.indexOf(overData);
      
        // Mover la fila en el array rowData
        this.rowData.splice(fromIndex, 1);
        this.rowData.splice(toIndex, 0, movingData);
      
        // Actualizar rowData
        this.rowData = [...this.rowData];
    }
  };



  constructor(private http: HttpClient) {
    this.loadGrid();
  }

  /**
   * Loads the last grid stored in the server
   */
  loadGrid() {
    this.http.get<any>('http://localhost:8080/import/getExampleData').subscribe((response) => {
      this.columnDefs = response.header;
      this.rowData = response.values;
    });
  }

  /**
   * Loads the column structure of the last grid stored in the server
   */
  loadGridStructure() {
    this.http.get<any>('http://localhost:8080/structure/getColumns').subscribe((response) => {
      this.columnDefs = response.header;
      this.rowData = response.values;
    });
  }

  /**
   * Persists the modifications in of the column in the server
   * @param event 
   */
  onCellValueChanged(event: any) {
    //Column info + position
    let body = {
      rowIndex: event.rowIndex,
      headerName: event.data.headerName,
      field: event.data.field,
      editable: event.data.editable
    }

    let req= this.http.post<any>('http://localhost:8080/structure/modifyColumn', body);

    req.subscribe({
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}

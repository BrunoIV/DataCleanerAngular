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
    sortable: false,
    filter: false
  };

  gridOptions = {
    animateRows: true,
    onRowDragEnd: (event: any) => {
        const movingData = event.node.data;
        const overData = event.overNode.data;
        const fromIndex = this.rowData.indexOf(movingData);
        const toIndex = this.rowData.indexOf(overData);
      
        // Move row
        this.rowData.splice(fromIndex, 1);
        this.rowData.splice(toIndex, 0, movingData);
      
        // Update rowData
        this.rowData = [...this.rowData];
    },

    onFirstDataRendered: (params: any) =>{
      const rows = document.querySelectorAll('.ag-cell');
      const headers = document.querySelectorAll('.ag-header-cell');

      //Deselect all columns when click on cell
      rows.forEach(row => {
        row.addEventListener('click', function(event){
          rows.forEach(r => {
            r.classList.remove('bg-selected');
          });
        })
      });
     
      //Click over the header
      headers.forEach(v => {
        v.addEventListener('click', function(event: any){
          rows.forEach(row => {

            //Add a background en each cell of the same index
            //Select multiple columns using "ctrl"
            if(v.ariaColIndex == row.ariaColIndex) {
              row.classList.add('bg-selected');
            } else if(!event.ctrlKey) {
              row.classList.remove('bg-selected');
            }
          });
        });
      });
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

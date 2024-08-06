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
  private selectedColumns : number[] = [];
  private selectedRows : number[] = [];
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


    onModelUpdated: (params: any) =>{
      this.addEvents();
    }
  };

  constructor(private http: HttpClient) {
    this.loadGrid();
  }

  addEvents() {
    const cells = document.querySelectorAll('.ag-cell');
    const _this = this;

    //Deselect all columns when click on cell
    cells.forEach(cell => {
      const fakeHeader = cell.ariaColIndex === "1";

      cell.addEventListener('click', function(event: any){

        //If is a regular column
        //or a "fake header" but there's a column selected
        //or there's a row selected and "ctrl" is not pressed
        if(!fakeHeader || _this.selectedColumns.length || (_this.selectedRows.length && !event.ctrlKey)) {
          _this.deselectAll();
        }

        if(fakeHeader) {
          _this.selectRow(parseInt(cell.innerHTML));
        }
      });
    });


    //Click over the header
    const headers = document.querySelectorAll('.ag-header-cell');
    headers.forEach(header => {
      header.addEventListener('click', function(event: any){
        const fakeHeader = header.ariaColIndex === "1";

        //If click in the "fake header" of auto-incremental column
        //or there's a row selected
        //or there's a column selected and "ctrl" is not pressed
        if(fakeHeader || _this.selectedRows.length || (_this.selectedColumns.length && !event.ctrlKey)) {
          _this.deselectAll();
        }

        if(header.ariaColIndex != null) {
          _this.selectColumn(header.ariaColIndex);
        }
      });
    });
  }

  /**
   * Removes the background of all cells of the grid and empty the list of selected columns and rows
   */
  deselectAll() {
    const cells = document.querySelectorAll('.ag-cell');
    cells.forEach(cell => {
      cell.classList.remove('bg-selected');
    });

    this.selectedColumns = [];
    this.selectedRows = [];
  }

  /**
   * Selects all cells of the row
   * @param nRow 
   */
  selectRow(nRow: number) {

    //First column is zero
    nRow--;
    this.selectedRows.push(nRow);
    var container = document.querySelector('.ag-center-cols-container');

    if(container != null && nRow >= 0 && nRow < container.children.length) {
      const cells = container.children[nRow].querySelectorAll('.ag-cell');

      cells.forEach(cell => {
        cell.classList.add('bg-selected');
      });
    }
  }

  /**
   * Selects all the cells of the column
   * @param colIndex - String with col index (starts in one)
   */
  selectColumn(colIndex: string) {
    const cells = document.querySelectorAll('.ag-cell');

    cells.forEach(cell => {
      //Add a background en each cell of the same index
      if(colIndex != null && colIndex == cell.ariaColIndex) {
        cell.classList.add('bg-selected');

        const index = parseInt(colIndex);
        if(!this.selectedColumns.includes(index)) {
          this.selectedColumns.push(index);
        }
      }
    });
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

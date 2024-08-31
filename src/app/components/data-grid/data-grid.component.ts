import { HttpClient, HttpParams } from '@angular/common/http';
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

  private idFile = 0;
  //Grid config
  columnDefs: ColDef[] = [];
  rowData : any[] = [];
  validationErrors : any[] = [];
  
  gridApi: any;
  gridColumnApi: any;

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
      this.showErrors();
    }
  };

  constructor(private http: HttpClient) {
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  showErrors() {
    const cells = document.querySelectorAll('.ag-cell');

    let rowNumber = 0;
    cells.forEach(cell => {
      const fakeHeader =  cell.ariaColIndex === "1";
      if(fakeHeader) {

        if(this.validationErrors[rowNumber] === undefined) {
          cell.classList.remove('validation_error');
        } else {
          cell.classList.add('validation_error');
        }
        rowNumber++;
      }
    });
  }

  deleteRow() {
    const selected :number[] = this.getSelectedRows();

    if(selected.length === 0) {
      alert('Please, select at least one row');
      return;
    }

    if (confirm('Are you sure you want to delete selected rows?')) {
      this.sendPost('structure/deleteRows', { 
        indexes: selected.join(','),
        idFile: this.idFile
      })
    }
  }

  deleteColumn() {
    const selected :number[] = this.getSelectedColumns();

    if(selected.length === 0) {
      alert('Please, select at least one column');
      return;
    }
    
    if (confirm('Are you sure you want to delete selected columns?')) {
      this.sendPost('structure/deleteColumns', { 
        indexes: selected.join(','),
        idFile: this.idFile
      })
    }
  }

  addEvents() {
    const cells = document.querySelectorAll('.ag-cell');
    const headers = document.querySelectorAll('.ag-header-cell');
    const _this = this;

    //Deselect all columns when click on cell
    cells.forEach(cell => {
      const fakeHeader = cell.ariaColIndex === "1";

      if (cell.hasAttribute('data-click-listener')) {
        return;
      }

      cell.setAttribute('data-click-listener', 'true');

      cell.addEventListener('click', function(event: any){
   

        //_this.deselectAll();
        _this.selectedColumns=[];

        //Drag cells has extra elements
        var base = event.srcElement;
        if(base.ariaColIndex == null) {
          base = base.parentNode.parentNode;
        }

        const colIndex = base.ariaColIndex - 2;
        const rowIndex = base.parentElement.ariaRowIndex - 2;
        cell.setAttribute('data-col-index', colIndex + "");

        //If is a regular cell or "ctrl" is not pressed
        if(!fakeHeader || !event.ctrlKey) {
          _this.selectedRows=[];
        }

        //Click in the left header
        if(fakeHeader) {
          const indexInArray = _this.selectedRows.indexOf(rowIndex);
          if(indexInArray === -1) {
            _this.selectedRows.push(rowIndex);
          } else {
            _this.selectedRows.splice(indexInArray, 1);
          }
        }


        _this.selectRows();

        //Header of current cell - First column is the "fake header"
        if(colIndex > 0) {
          headers[colIndex].classList.add('bg-range-selected');

          //First cell of current row
          base.parentElement.children[0].classList.add('bg-selected');
          cell.classList.add('bg-selected');
       }

      });
    });


    //Click over the header
    headers.forEach(header => {
      if (header.hasAttribute('data-click-listener')) {
        return;
      }

      header.setAttribute('data-click-listener', 'true');

      header.addEventListener('click', function(event: any){
        if(header != null && header.ariaColIndex != null) {
          const colIndex :number = parseInt(header.ariaColIndex) - 2;
          const fakeHeader = colIndex === -1;
          _this.selectedRows=[];

          //If click in the header of auto-incremental column
          //or "ctrl" is not pressed
          if(fakeHeader || !event.ctrlKey) {
            _this.selectedColumns = [];
          }

          if(fakeHeader) {
            //Selects all
            for(let i = 0; i < _this.columnDefs.length; i++) {
              _this.selectedColumns.push(i);
            }
          } else {
            const indexInArray = _this.selectedColumns.indexOf(colIndex);

            if(indexInArray === -1) {
              _this.selectedColumns.push(colIndex);
            } else {
              _this.selectedColumns.splice(indexInArray, 1);
            }
          }

          _this.selectColumn();
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
      cell.classList.remove('bg-range-selected');
    });

    const headers = document.querySelectorAll('.ag-header-cell');
    headers.forEach(header => {
      header.classList.remove('bg-range-selected');
    });
  }

  /**
   * Selects all cells of the selectedRows
   */
  selectRows() {
    this.deselectAll();

    this.selectedRows.forEach(function(rowIndex) {
      let container = document.querySelector('.ag-center-cols-container');

      if(container != null) {
        const cells = container.children[rowIndex].querySelectorAll('.ag-cell');

        cells.forEach(cell => {
          cell.classList.add('bg-range-selected');
        });
      }
    });
  }

  /**
   * Selects all the cells of the column
   * @param colIndex - String with col index (starts in one)
   */
  selectColumn() {
    this.deselectAll();
    const headers = document.querySelectorAll('.ag-header-cell');
    const cells = document.querySelectorAll('.ag-cell');

    this.selectedColumns.forEach(function(colIndex) {
      headers.forEach(header => {
        //Add a background en each cell of the same index
        if(header.ariaColIndex != null && colIndex == (parseInt(header.ariaColIndex) - 2)) {
          header.classList.add('bg-range-selected');
        }
      });

      cells.forEach(cell => {
        if(cell.ariaColIndex != null && colIndex == (parseInt(cell.ariaColIndex) - 2)) {
          cell.classList.add('bg-range-selected');
        }
      });
    });
  }

  /**
   * 
   */
  loadGrid(idFile: number) {
    this.idFile = idFile;
    
    this.http.get<any>('http://localhost:8080/data/getData/' + idFile).subscribe((response) => {
      this.columnDefs = response.header;
      this.rowData = response.values;
      this.validationErrors = response.validationErrors;
    });
  }

  /**
   * Persists the modifications 
   * @param event 
   */
  onCellValueChanged(params: any) {
    const colIndex = this.columnDefs.findIndex(col => col.field === params.column.colId);

    const body = {
      rowIndex: params.rowIndex,
      colIndex: colIndex - 1,
      value: params.value,
      idFile: this.idFile
    }

    this.sendPostJson('data/modifyValue', body);
  }


  addRowBegin() {
    this.addRowAtPosition(0);
  }

  addRowEnd() {
    this.addRowAtPosition(this.rowData.length);
  }

  addRowUp() {
    const selectedItems = this.selectedRows.length;
    if(selectedItems === 0) {
      alert('Please, select a row');
    } else {
      this.addRowAtPosition(this.selectedRows[selectedItems - 1]);
    }
  }

  addRowDown() {
    const selectedItems = this.selectedRows.length;
    if(selectedItems === 0) {
      alert('Please, select a row');
    } else {
      this.addRowAtPosition(this.selectedRows[selectedItems - 1] + 1);
    }
  }



  addColumnStart() {
    this.addColumnAtPosition(0);
  }

  addColumnEnd() {
    this.addColumnAtPosition(this.columnDefs.length - 1);
  }

  addColumnLeft() {
    const selected = this.selectedColumns.length;
    if(selected === 0) {
      alert('Please, select a column');
    } else {
      this.addColumnAtPosition(this.selectedColumns[selected - 1]);
    }
  }

  addColumnRight() {
    const selectedItems = this.selectedColumns.length;
    if(selectedItems === 0) {
      alert('Please, select a column');
    } else {
      this.addColumnAtPosition(this.selectedColumns[selectedItems - 1] + 1);
    }
  }

  addColumnAtPosition(position: number) {
    let name = prompt('Column name?');

    if(name !== null && name.trim() !== '') {
      this.sendPost('structure/addColumn', {name: name, position: position, idFile: this.idFile});
    }
  }

  addRowAtPosition(position: number) {
    this.sendPost('structure/addRow', {position: position, idFile: this.idFile});
  }

  getSelectedColumns() :number[] {
    return this.selectedColumns;
  }

  getSelectedRows() :number[] {
    return this.selectedRows;
  }

  sendPost(url: string, params: any) :void {
    let body = new HttpParams();

    Object.keys(params).forEach(key => {
      body = body.set(key, params[key].toString());
    });

    const req = this.http.post<any>('http://localhost:8080/' + url, body);

    req.subscribe({
      next: (response: any) => {
        this.columnDefs = response.header;
        this.rowData = response.values;
        this.validationErrors = response.validationErrors;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  sendPostJson(url: string, params: any) :void {
    const req = this.http.post<any>('http://localhost:8080/' + url, params);

    req.subscribe({
      next: (response: any) => {
        this.columnDefs = response.header;
        this.rowData = response.values;
        this.validationErrors = response.validationErrors;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  joinColumn() {
    const body = {
      indexes: this.selectedColumns.join(','),
      ifFile: this.idFile
    }

    this.sendPost('structure/joinColumns', body);
  }

}

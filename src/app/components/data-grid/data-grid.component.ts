import { Component, EventEmitter, Output } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { DataService } from '../../services/data.service';
import { StructureService } from '../../services/structure.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'data-grid',
  standalone: true,
  imports: [AgGridModule],
  providers: [DataService, StructureService],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.css'
})
export class DataGridComponent {

  constructor(
    private dataService: DataService,
    private structureService: StructureService) {
  }

  private idFile = 0;

  //Grid config
  columnDefs: ColDef[] = [];
  rowData : any[] = [];
  
  gridApi: any;
  gridColumnApi: any;
  rowSelection: number = 2;

  private selectedColumns : number[] = [];
  private selectedRows : number[] = [];

  private selectedCellColumn: number = -1;
  private selectedCellRow: number = -1;

  defaultColDef = {
    sortable: false,
    filter: false
  };


  @Output() unsavedChanges = new EventEmitter<boolean>();
  setUnsavedChanges(value: boolean): void {
    this.unsavedChanges.emit(value);
  }

  gridOptions = {
    animateRows: true,
    suppressRowClickSelection: true,
    rowHeight: 26,
    headerHeight: 26,

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


  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }


  selectCell(row: number, column: string) {
    this.gridApi.startEditingCell({
      rowIndex: row,
      colKey: column
    });
  }

  deleteRow() {
    const selected :number[] = this.getSelectedRows();

    if(selected.length === 0) {
      alert('Please, select at least one row');
      return;
    }

    if (confirm('Are you sure you want to delete selected rows?')) {
      this.structureService.deleteRows(selected.join(','), this.idFile).subscribe({
        next: (response: any) => {
          this.setUnsavedChanges(true);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  deleteColumn() {
    const selected :number[] = this.getSelectedColumns();

    if(selected.length === 0) {
      alert('Please, select at least one column');
      return;
    }
    
    if (confirm('Are you sure you want to delete selected columns?')) {
      this.structureService.deleteColumns(selected.join(','), this.idFile).subscribe({
        next: (response: any) => {
          this.loadGridNoResponse(this.idFile);
          this.setUnsavedChanges(true);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
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
        _this.selectedCellColumn = colIndex;
        _this.selectedCellRow = rowIndex;

        cell.setAttribute('data-col-index', colIndex + "");


        //If is a regular cell and "ctrl" is not pressed or "shift" is not pressed
        if(!fakeHeader || (!event.ctrlKey && !event.shiftKey)) {
          _this.selectedRows=[];
        }


        //Click in the left header
        if(fakeHeader) {
          
          //Shift is pressed and there's previous row selected
          let numberOfSelectedRows = _this.selectedRows.length;
          if(!!event.shiftKey && numberOfSelectedRows > 0) {
            const lastSelectedRow = _this.selectedRows[numberOfSelectedRows - 1];
            let start = lastSelectedRow < rowIndex ? lastSelectedRow : rowIndex;
            const end = lastSelectedRow > rowIndex ? lastSelectedRow : rowIndex;
  
            for(;start <= end;start++) {
              const indexInArray = _this.selectedRows.indexOf(start);
              if(indexInArray === -1) {
                _this.selectedRows.push(start);
              }
            }
          } else {
            const indexInArray = _this.selectedRows.indexOf(rowIndex);
            if(indexInArray === -1) {
              _this.selectedRows.push(rowIndex);
            } else {
              _this.selectedRows.splice(indexInArray, 1);
            }
          }
        }
        
        _this.deselectAll();
        _this.selectRows();

        if(colIndex > -1) {
          //Header of current cell - First column is the "fake header"
          headers[colIndex + 1].classList.add('bg-range-selected');
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

          //Keep selection if "ctrl" or "shift" is pressed
          if(!event.ctrlKey && !event.shiftKey) {
            _this.selectedColumns = [];
          }

          //The first row (#) selects all columns
          if(fakeHeader) {
            for(let i = 0; i < _this.columnDefs.length; i++) {
              _this.selectedColumns.push(i);
            }

            for(let i = 0; i < _this.rowData.length; i++) {
              _this.selectedRows.push(i);
            }
          } else {
            //Shift is pressed and there's previous row selected
            let numberOfSelectedColumns = _this.selectedColumns.length;
              if(!!event.shiftKey && numberOfSelectedColumns > 0) {
                const lastSelectedColumn = _this.selectedColumns[numberOfSelectedColumns - 1];
                let start = lastSelectedColumn < colIndex ? lastSelectedColumn : colIndex;
                const end = lastSelectedColumn > colIndex ? lastSelectedColumn : colIndex;
      
                for(;start <= end;start++) {
                  const indexInArray = _this.selectedColumns.indexOf(start);
                  if(indexInArray === -1) {
                    _this.selectedColumns.push(start);
                  }
                }
              } else {
                const indexInArray = _this.selectedColumns.indexOf(colIndex);

                if(indexInArray === -1) {
                  _this.selectedColumns.push(colIndex);
                } else {
                  _this.selectedColumns.splice(indexInArray, 1);
                }
              }
          
          }

          _this.deselectAll();
          _this.selectColumn();
          _this.selectRows();
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
  loadGrid(idFile: number): Observable<any> {
    this.idFile = idFile;
    
    return this.dataService.getRecords(idFile).pipe(
      tap((response) => {
        this.columnDefs = response.header;
        this.rowData = response.values;
        this.setUnsavedChanges(response.unsavedChanges);
      })
    );
  }

  loadGridHistory(idFile: number): Observable<any> {
    this.idFile = idFile;
    
    return this.dataService.getRecordsFromHistory(idFile).pipe(
      tap((response) => {
        this.columnDefs = response.header;
        this.rowData = response.values;
        this.setUnsavedChanges(response.unsavedChanges);
      })
    );
  }
  

  loadGridNoResponse(idFile: number) {
    this.loadGrid(idFile).subscribe({
      next: (response: any) => {
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  /**
   * Persists the modifications s
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

    this.dataService.modifyValue(body).subscribe({
      next: (response: any) => {
        this.setUnsavedChanges(true);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }


  addRowBegin() {
    this.addRowAtPosition(0);
  }

  addRowEnd() {
    this.addRowAtPosition(this.rowData.length);
  }

  addRowUp() {
    const selection = this.getSelectedRows();
    const selectedItems = selection.length;
    if(selectedItems === 0) {
      alert('Please, select a row');
    } else {
      this.addRowAtPosition(selection[selectedItems - 1]);
    }
  }

  addRowDown() {
    const selection = this.getSelectedRows();
    const selectedItems = selection.length;
    if(selectedItems === 0) {
      alert('Please, select a row');
    } else {
      this.addRowAtPosition(selection[selectedItems - 1] + 1);
    }
  }

  addColumnStart() {
    this.addColumnAtPosition(0);
  }

  addColumnEnd() {
    this.addColumnAtPosition(this.columnDefs.length - 1);
  }

  addColumnLeft() {
    const selection = this.getSelectedColumns();
    const selected = selection.length;
    if(selected === 0) {
      alert('Please, select a column');
    } else {
      this.addColumnAtPosition(selection[selected - 1]);
    }
  }

  addColumnRight() {
    const selection = this.getSelectedColumns();
    const selected = selection.length;
    if(selected === 0) {
      alert('Please, select a column');
    } else {
      this.addColumnAtPosition(selection[selected - 1] + 1);
    }
  }

  addColumnAtPosition(position: number, ) {
    let name = prompt('Column name?');

    if(name !== null && name.trim() !== '') {
      this.structureService.addColumn(name, position, this.idFile).subscribe({
        next: (response: any) => {
          this.loadGridNoResponse(this.idFile);
          this.setUnsavedChanges(true);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  addRowAtPosition(position: number) {
    this.structureService.addRow(position, this.idFile).subscribe({
      next: (response: any) => {
        this.loadGridNoResponse(this.idFile);
        this.setUnsavedChanges(true);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  getSelectedColumns() :number[] {
    if(this.selectedColumns.length) {
      return this.selectedColumns;
    } else if(this.selectedCellColumn >= 0) {
      return [this.selectedCellColumn];
    }
    return [];
  }

  getSelectedRows() :number[] {
    if(this.selectedRows.length) {
      return this.selectedRows;
    } else if(this.selectedCellRow >= 0) {
      return [this.selectedCellRow];
    }
    return [];
  }

  joinColumn() {
    this.structureService.joinColumns(this.selectedColumns.join(','), this.idFile).subscribe({
      next: (response: any) => {
        this.loadGridNoResponse(this.idFile);
        this.setUnsavedChanges(true);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

}

import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RibbonMenuComponent } from './components/ribbon-menu/ribbon-menu.component';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DataService } from './services/data.service';
import { FileService } from './services/file.service';


import { MatDialog } from '@angular/material/dialog';
import { AppDialogComponent } from './components/app-dialog/app-dialog.component';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import { ToastService } from './services/toast.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DataGridComponent, SidebarComponent, RibbonMenuComponent, ToastMessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild(DataGridComponent) private gridComponent!: DataGridComponent;
  @ViewChild(SidebarComponent) private sidebarComponent!: SidebarComponent;
  @ViewChild(ToastMessageComponent) private toast!: ToastMessageComponent;

  private selectedFile: number = 0;
  public unsavedChanges: boolean = false;
  public validationErrors : any[] = [];
  public historyList: any[] = [];
  public historySelected: number = 0;
  public validationSelected :number = 0;

  constructor(private dataService: DataService, 
    private fileService: FileService, 
    private toastService: ToastService, 
    public dialog: MatDialog) {
  }


  showSuccessMessage() {
    this.toastService.success('Operation completed successfully!');
  }

  openDialogZscore(): void {
    const columns:number[] = this.gridComponent.getSelectedColumns();
    if(!columns.length) {
      this.toastService.warning('Please, select at least one column');
      return
    }

    const dialogRef = this.dialog.open(AppDialogComponent, {
      width: '330px',
      data: {
        title: 'Z-Score',
        selectedOption: 1,
        fields: [
          {name: 'min', type: 'number', label: 'Min Value: ', required: true, value: 0 },
          {name: 'max', type: 'number', label: 'Max Value: ', required: true, value: 100 },
          {name: 'removeModify', type: 'radio', label: 'Modify values to fit the range', value: 1},
          {name: 'removeModify', type: 'radio', label: 'Remove values outside the range', value: 2 }
        ],
        
        onConfirm: () => {
          this.dataService.zscore(columns, this.selectedFile, 0, 100, false).subscribe({
            next: (response: any) => {
              this.unsavedChanges = response.unsavedChanges;
              this.loadFile(this.selectedFile);
            },
            error: (error: any) => {
              this.toastService.error(error);
            }
          });


          console.log('Form data:', dialogRef.componentInstance.data);
          console.log('Confirmed!');
          dialogRef.close();
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialogPercentile(): void {
    this.showSuccessMessage();
  }

  loadFile(id: number) {
    this.selectedFile = id;
 

    this.gridComponent.loadGrid(id).subscribe({
      next: (response: any) => {
        this.unsavedChanges = response.unsavedChanges;
      },
      error: (error: any) => {
        this.toastService.error(error);
      }
    });
  }

  loadHistory(id:number) {
    this.dataService.getHistory(id).subscribe({
      next: (response: any) => {
        this.historyList = response;
      },
      error: (error: any) => {
        this.toastService.error(error);
      }
    }); 
  }
  

  openHistory(id: number) {
    this.gridComponent.loadGridHistory(id).subscribe({
      next: (response: any) => {
        this.unsavedChanges = response.unsavedChanges;
        this.validationErrors = [];
        this.validationSelected = 0;
      },
      error: (error: any) => {
        this.toastService.error(error);
      }
    });
  }

  doSave() {
    this.fileService.save(this.selectedFile).subscribe({
      next: (response: any) => {
        this.unsavedChanges = false;
        this.sidebarComponent.loadFiles();
      },
      error: (error: any) => {
        this.toastService.error(error);
      }
    });
  }

  doSaveAs() {
    let name = prompt('New name?');

    if(name !== null && name.trim() !== '') {
      this.fileService.saveAs(this.selectedFile, name).subscribe({
        next: (response: any) => {
          this.unsavedChanges = false;
          this.sidebarComponent.loadFiles();
        },
        error: (error: any) => {
          this.toastService.error(error);
        }
      });
    }
  }

  doNewFile(type: string) {
    let name = prompt('New name?');

    if(name !== null && name.trim() !== '') {
      this.fileService.newFile(type, name).subscribe({
        next: (response: any) => {
          this.sidebarComponent.loadFiles();
        },
        error: (error: any) => {
          this.toastService.error(error);
        }
      });
    }
  }

  
  private actionMap: { [key: string]: Function } = {

    //File
    new_file: () => this.doNewFile('table'),
    save_as: () => this.doSaveAs(),
    save: () => this.doSave(),
    import_: (id: string) => this.selectFile(id),
    export_: (format: string) => this.fileService.export(this.selectedFile, format),
    

    //Structure
    add_column_start: () => this.gridComponent.addColumnStart(),
    add_column_left: () => this.gridComponent.addColumnLeft(),
    add_column_right: () => this.gridComponent.addColumnRight(),
    add_column_end: () => this.gridComponent.addColumnEnd(),
    delete_column: () => this.gridComponent.deleteColumn(),
    join_column: () => this.gridComponent.joinColumn(),

    add_row_begin: () => this.gridComponent.addRowBegin(),
    add_row_up: () => this.gridComponent.addRowUp(),
    add_row_down: () => this.gridComponent.addRowDown(),
    add_row_end: () => this.gridComponent.addRowEnd(),
    delete_row: () => this.gridComponent.deleteRow(),
    

    //Data
    normalization_: (fn: string) => this.normalize(fn),
    validation_: (fn: string) => this.validate(fn),
    fill_column_numbered: () => this.fillAutoIncremental(),
    fill_fixed_value: () => this.fillFixedValue(),
    outliners_zscore: () => this.openDialogZscore(),
    outliners_percentile: () => this.openDialogPercentile(),

  };


  fillFixedValue() {
    const columns:number[] = this.gridComponent.getSelectedColumns();
    if(!columns.length) {
      this.toastService.warning('Please, select at least one column');
      return
    }

    const newValue = prompt('Please, introduce the new value');
    if(newValue !== null) {
      this.dataService.fillFixedValue(columns, this.selectedFile, newValue).subscribe({
        next: (response: any) => {
          this.gridComponent.loadGridNoResponse(this.selectedFile);
        },
        error: (error: any) => {
          this.toastService.error(error);
        }
      });
    }
  }
  
  
  fillAutoIncremental() {
    const columns:number[] = this.gridComponent.getSelectedColumns();
    if(!columns.length) {
      this.toastService.warning('Please, select at least one column');
      return
    }

    this.dataService.fillAutoIncremental(columns, this.selectedFile).subscribe({
      next: (response: any) => {
        this.gridComponent.loadGridNoResponse(this.selectedFile);
      },
      error: (error: any) => {
        this.toastService.error(error);
      }
    });
  }

  onUnsavedChanges(value: boolean): void {
    this.unsavedChanges = value;
    this.loadHistory(this.selectedFile);
    this.sidebarComponent.loadFiles();
  }

  handleButtonClick(buttonId: string): void {
    for (let key in this.actionMap) {
      if (buttonId.startsWith(key)) {
        const parameter = buttonId.replace(key, '');
        this.actionMap[key](parameter);

        if(this.selectedFile > 0) {
          this.loadHistory(this.selectedFile);
        }
        return;
      }
    }

    this.toastService.error(buttonId + ' Not implemented');
  }

  validate(functionName: string): void {
    const columns:number[] = this.gridComponent.getSelectedColumns();
    if(!columns.length) {
      this.toastService.warning('Please, select at least one column');
      return
    }

    this.dataService.validate(columns, this.selectedFile, functionName).subscribe({
      next: (response: any) => {
        this.validationErrors = response;
        const radio = document.getElementById('status_bar_validations') as HTMLInputElement;
        if (radio) {
          radio.checked = true;
        }
      },
      error: (error: any) => {
        this.toastService.error(error);
      }
    });
  }

  normalize(functionName: string): void {
    const columns:number[] = this.gridComponent.getSelectedColumns();
    if(!columns.length) {
      this.toastService.warning('Please, select at least one column');
      return
    }

    this.dataService.normalize(columns, this.selectedFile, functionName).subscribe({
      next: (response: any) => {
        this.gridComponent.loadGridNoResponse(this.selectedFile);
      },
      error: (error: any) => {
        this.toastService.error(error);
      }
    });
    
  }


  selectFile(format :string) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.accept = '.' + format;

    fileInput.addEventListener('change', (event: any) => {
      const selectedFile = event.target.files[0];

      this.onFileSelected(event, format);
      document.body.removeChild(fileInput);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
  }

  editCell(line: number, column: string) {
    this.gridComponent.selectCell(line, column);
  }

  onFileSelected(event: any, format :string) {
    const selectedFile = event.target.files[0];
    this.fileService.importFile(selectedFile, format).subscribe({
      next: (response: any) => {
        this.gridComponent.rowData = response.values;
        this.gridComponent.columnDefs = response.header;
        this.sidebarComponent.loadFiles();
      },
      error: (error: any) => {
        this.toastService.error(error);
      }
    });
  }
}

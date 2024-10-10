import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RibbonMenuComponent } from './components/ribbon-menu/ribbon-menu.component';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DataService } from './services/data.service';
import { FileService } from './services/file.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DataGridComponent, SidebarComponent, RibbonMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild(DataGridComponent) private gridComponent!: DataGridComponent;
  @ViewChild(SidebarComponent) private sidebarComponent!: SidebarComponent;

  private selectedFile: number = 0;
  public unsavedChanges: boolean = false;
  public validationErrors : any[] = [];
  public historyList: any[] = [];
  public historySelected: number = 0;
  public validationSelected :number = 0;

  constructor(private dataService: DataService, private fileService: FileService) {
  }

  loadFile(id: number) {
    this.selectedFile = id;
 

    this.gridComponent.loadGrid(id).subscribe({
      next: (response: any) => {
        this.unsavedChanges = response.unsavedChanges;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  loadHistory(id:number) {
    this.fileService.getHistory(id).subscribe({
      next: (response: any) => {
        this.historyList = response;
      },
      error: (error: any) => {
        console.log(error);
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
        console.log(error);
      }
    });
  }

  doSave() {
    this.fileService.save(this.selectedFile).subscribe({
      next: (response: any) => {
        this.unsavedChanges = false;
      },
      error: (error: any) => {
        console.log(error);
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
          console.log(error);
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
          console.log(error);
        }
      });
    }
  }

  
  private actionMap: { [key: string]: Function } = {

    //Save
    save_as: () => this.doSaveAs(),
    save: () => this.doSave(),

    //Next
    //new_list: () => this.doNewFile('list'),
    //new_map: () => this.doNewFile('map'),
    //new_table: () => this.doNewFile('table'),

    //Import/Export
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
    fill_fixed_value: () => this.fillFixedValue()
  };


  fillFixedValue() {
    const columns:number[] = this.gridComponent.getSelectedColumns();
    if(!columns.length) {
      alert('Please, select at least one column');
      return
    }

    const newValue = prompt('Please, introduce the new value');
    if(newValue !== null) {
      this.dataService.fillFixedValue(columns, this.selectedFile, newValue).subscribe({
        next: (response: any) => {
          this.gridComponent.loadGridNoResponse(this.selectedFile);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }
  
  
  fillAutoIncremental() {
    const columns:number[] = this.gridComponent.getSelectedColumns();
    if(!columns.length) {
      alert('Please, select at least one column');
      return
    }

    this.dataService.fillAutoIncremental(columns, this.selectedFile).subscribe({
      next: (response: any) => {
        this.gridComponent.loadGridNoResponse(this.selectedFile);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  onUnsavedChanges(value: boolean): void {
    this.unsavedChanges = value;
    this.loadHistory(this.selectedFile);
  }

  handleButtonClick(buttonId: string): void {
    for (let key in this.actionMap) {
      if (buttonId.startsWith(key)) {
        const parameter = buttonId.replace(key, '');
        this.actionMap[key](parameter);
        this.loadHistory(this.selectedFile);
        return;
      }
    }
    alert(buttonId + ' Not implemented');
  }

  validate(functionName: string): void {
    const columns:number[] = this.gridComponent.getSelectedColumns();
    if(!columns.length) {
      alert('Please, select at least one column');
      return
    }

    this.dataService.validate(columns, this.selectedFile, functionName).subscribe({
      next: (response: any) => {
        this.validationErrors = response;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  normalize(functionName: string): void {
    const columns:number[] = this.gridComponent.getSelectedColumns();
    if(!columns.length) {
      alert('Please, select at least one column');
      return
    }

    this.dataService.normalize(columns, this.selectedFile, functionName).subscribe({
      next: (response: any) => {
        this.gridComponent.loadGridNoResponse(this.selectedFile);
      },
      error: (error: any) => {
        console.log(error);
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
        this.sidebarComponent.loadFiles(true);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}

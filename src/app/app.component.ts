import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RibbonMenuComponent } from './components/ribbon-menu/ribbon-menu.component';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, DataGridComponent, SidebarComponent, RibbonMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild(DataGridComponent) private gridComponent!: DataGridComponent;

  private selectedFile: number = 0;

  constructor(private http: HttpClient) {
  }

  loadFile(id: number) {
    this.gridComponent.loadGrid(id);
    this.selectedFile = id;
  }
  
  private actionMap: { [key: string]: Function } = {
    import_: (id: string) => this.selectFile(id),
    export_: (format: string) => window.open('http://localhost:8080/file/export/' + format, '_blank'),
    

    //Structure
    add_column_start: () => this.gridComponent.addColumnStart(),
    add_column_left: () => this.gridComponent.addColumnLeft(),
    add_column_right: () => this.gridComponent.addColumnRight(),
    add_column_end: () => this.gridComponent.addColumnEnd(),
    delete_column: () => this.gridComponent.deleteColumn(),

    add_row_begin: () => this.gridComponent.addRowBegin(),
    add_row_up: () => this.gridComponent.addRowUp(),
    add_row_down: () => this.gridComponent.addRowDown(),
    add_row_end: () => this.gridComponent.addRowEnd(),
    delete_row: () => this.gridComponent.deleteRow(),
    

    //Data
    normalization_: (fn: string) => this.normalize(fn),
    validation_: (fn: string) => this.validate(fn),
  };


  sendPost(url: string, params: any, callback: Function = function(){}) :void {
    let body = new HttpParams();

    Object.keys(params).forEach(key => {
      body = body.set(key, params[key].toString());
    });

    const req = this.http.post<any>('http://localhost:8080/' + url, body);

    req.subscribe({
      next: (response: any) => {
        callback(response);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }




  handleButtonClick(buttonId: string): void {
    for (let key in this.actionMap) {
      if (buttonId.startsWith(key)) {
        const parameter = buttonId.replace(key, '');
        this.actionMap[key](parameter);
        return;
      }
    }
    alert(buttonId + ' Not implemented');
  }

  validate(functionName: string): void {
    const columns:number[] = this.gridComponent.getSelectedColumns();

    const formData = new FormData();
    formData.append('columns', columns.join(','));
    formData.append('functionName', 'validate_' + functionName);
    const upload$ = this.http.post('http://localhost:8080/data/validate', formData);

    upload$.subscribe({
      next: (response: any) => {
        this.gridComponent.loadGrid(this.selectedFile);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  normalize(functionName: string): void {
    const columns:number[] = this.gridComponent.getSelectedColumns();

    const formData = new FormData();
    formData.append('columns', columns.join(','));
    formData.append('functionName', functionName);
    const upload$ = this.http.post('http://localhost:8080/data/normalize', formData);

    upload$.subscribe({
      next: (response: any) => {
        this.gridComponent.loadGrid(this.selectedFile);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
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

  onFileSelected(event: any, format :string) {
    const selectedFile = event.target.files[0];
    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);

    const upload$ = this.http.post('http://localhost:8080/file/import/' + format, formData);

    upload$.subscribe({
      next: (response: any) => {
        this.gridComponent.loadGrid(this.selectedFile);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}

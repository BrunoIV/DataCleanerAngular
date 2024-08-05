import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RibbonMenuComponent } from './components/ribbon-menu/ribbon-menu.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataGridComponent } from './components/data-grid/data-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, DataGridComponent, RibbonMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild(DataGridComponent) private gridComponent!: DataGridComponent;
  private currentTab = '';

  constructor(private http: HttpClient) {}

  handleTab(tabId: string) :void {
    this.currentTab = tabId;

    if(tabId == 'menu_structure') {
      this.gridComponent.loadGridStructure();
    }else {
      this.gridComponent.loadGrid();
    }

  }
  
  handleButtonClick(buttonId: string): void {
    if(buttonId.startsWith('menu_')) {
      this.handleTab(buttonId);
    } else if(buttonId.startsWith('import_')) {
      this.selectFile(buttonId.replace('import_', ''));
    } else {
      alert(buttonId + ' Not implemented');
    }
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

    const upload$ = this.http.post('http://localhost:8080/import/' + format, formData);

    upload$.subscribe({
      next: (response: any) => {
        this.gridComponent.loadGrid();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}

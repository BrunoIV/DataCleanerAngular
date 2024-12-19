import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {


  constructor(private fileService: FileService) {
    this.loadFiles();
  }

  @Output() loadFileId = new EventEmitter<number>();
  public filteredFiles: any[] = [];
  public allFiles: any[] = [];
  public lateralTab = 'tab_files';
  public selectedFile: number = 0;
  public lateralIcons :any[] = [{
    id: 'tab_files',
    icon: 'draft'
/*  },{
    id: 'tab_config',
    icon: 'settings'*/
  }];


  searchFile(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredFiles = this.allFiles.filter(file => file.name.includes(inputValue));
  }


  toggleLateralTab(tabName: string) {
    if(this.lateralTab === tabName) {
      this.lateralTab = '';
    } else {
      this.lateralTab = tabName;
    }
    
  }

  newFile() {
    const fileName = prompt('Name of file?');
    if(fileName !== null && fileName !== '') {
      this.fileService.newFile('table', fileName).subscribe({
        next: (response: any) => {
          this.loadFiles();
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  deleteFile(){
    if(confirm('Are you sure you want to delete this file?')) {
      this.fileService.deleteFile(this.selectedFile).subscribe({
        next: (response: any) => {
          this.loadFiles();
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  loadFiles(selectLast :boolean = false) {
    this.fileService.getFiles().subscribe({
      next: (response: any) => {
        this.allFiles = response;
        this.filteredFiles = response;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  openFile(index: number) {
    this.selectedFile = index;
    this.loadFileId.emit(index);
  }
}

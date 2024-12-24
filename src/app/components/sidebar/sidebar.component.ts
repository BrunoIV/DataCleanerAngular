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

  private search = '';
  public filteredFiles: any[] = [];
  public allFiles: any[] = [];
  public lateralTab = 'tab_files';
  public currentFile: number = 0;
  public selectedFiles: number[] = [];
  public lateralIcons :any[] = [{
    id: 'tab_files',
    icon: 'draft'
/*  },{
    id: 'tab_config',
    icon: 'settings'*/
  }];


  searchFile(event: Event): void {
    this.search = (event.target as HTMLInputElement).value;
    this.filterFiles();
  }

  filterFiles(): void {
    this.filteredFiles = this.allFiles.filter(file => file.name.includes(this.search));
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
    if(confirm('Are you sure you want to delete this file(s)?')) {
      this.fileService.deleteFiles(this.selectedFiles).subscribe({
        next: (response: any) => {
          this.loadFiles();
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  loadFiles() {
    this.fileService.getFiles().subscribe({
      next: (response: any) => {
        this.allFiles = response;
        this.filteredFiles = response;
        this.filterFiles();
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  openFile(index: number, event: MouseEvent) {

    if(event.ctrlKey) {
      this.selectedFiles.push(index);
    } else if(event.shiftKey) {

      const min = index < this.currentFile ? index : this.currentFile;
      const max = index > this.currentFile ? index : this.currentFile;

      //Marcar todo
      let select = false;
      let _this = this;
      this.selectedFiles = [];

      this.filteredFiles.forEach(function(file) {

        if(file.id === min) {
          select = true;
        }

        if(select === true) {
          _this.selectedFiles.push(file.id);
        }

        if(file.id === max) {
          select = false;
        }
      });

    } else {
      this.selectedFiles = [index];
    }

    if(!event.ctrlKey && !event.shiftKey) {
      this.currentFile = index;
      this.loadFileId.emit(index);
    }
  }
}

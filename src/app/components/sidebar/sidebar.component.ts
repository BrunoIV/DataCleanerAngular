import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FileService } from '../../services/file.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {


  constructor(
    private fileService: FileService,
    private toastService: ToastService
  ) {
    this.loadFiles();
  }

  @Output() loadFileId = new EventEmitter<number>();

  private search = '';
  public filteredFiles: any[] = [];
  public allFiles: any[] = [];
  public lateralTab = 'tab_files';
  public currentFile: number = 0;
  public selectedFiles: number[] = [];
  public contextMenuIsOpen :boolean = false;
  private x :number = 0;
  private y:number = 0;
  public idFileRightSelection: number = 0;


  public lateralIcons :any[] = [{
    id: 'tab_files',
    icon: 'draft'
/*  },{
    id: 'tab_config',
    icon: 'settings'*/
  }];


  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    this.contextMenuIsOpen = false;
  }

  onRightClickFile(event: MouseEvent, id: number) {
    event.preventDefault();
    event.stopPropagation();

    //Right click on one of the selected files
    if(this.selectedFiles.includes(id)) {
      this.idFileRightSelection = 0;
    } else {
      this.idFileRightSelection = id;
    }

    this.x = event.clientX;
    this.y = event.clientY;
    this.contextMenuIsOpen = true;
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.idFileRightSelection = 0;

    this.x = event.clientX;
    this.y = event.clientY;
    this.contextMenuIsOpen = true;
  }

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
    if(fileName !== null && fileName.trim() !== '') {
      this.fileService.newFile('table', fileName).subscribe({
        next: (response: any) => {
          this.loadFiles();
        },
        error: (error: any) => {
          this.toastService.error(error);
        }
      });
    }
  }

  cloneFile() {
    this.fileService.cloneFile(this.getRealSelection()).subscribe({
      next: (response: any) => {
        this.loadFiles();
      },
      error: (error: any) => {
        this.toastService.error(error);
      }
    });
  }

  renameFile() {
    const fileName = prompt('Name of file?');

    if(fileName !== null && fileName.trim() !== '') {
      this.fileService.renameFile(this.getRealSelection()[0], fileName).subscribe({
        next: (response: any) => {
          this.loadFiles();
        },
        error: (error: any) => {
          this.toastService.error(error);
        }
      });
    }
  }

  getRealSelection() :number[] {

    //If the file selected with a right-click is part of the files selected with a left-click.
    if(this.selectedFiles.includes(this.idFileRightSelection)) {
      return this.selectedFiles;
    }

    return [this.idFileRightSelection];
  }

  deleteFile(){
    if(this.getRealSelection().length === 0) {
      this.toastService.warning('Please, select at least one file');
      return;
    }

    if(confirm('Are you sure you want to delete this file(s)?')) {
      this.fileService.deleteFiles(this.getRealSelection()).subscribe({
        next: (response: any) => {
          this.loadFiles();
        },
        error: (error: any) => {
          this.toastService.error(error);
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
        this.toastService.error(error);
      }
    });
  }

  showContextMenu() {
    return {
      top: this.y + 'px',
      left: this.x + 'px'
    }
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

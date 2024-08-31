import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Output() loadFileId = new EventEmitter<number>();
  public files: any[] = [];
  public lateralTab = 'tab_files';
  public selectedFile: number = 0;
  public lateralIcons :any[] = [{
    id: 'tab_files',
    icon: 'draft'
/*  },{
    id: 'tab_config',
    icon: 'settings'*/
  }];


  constructor(private http: HttpClient) {
    this.loadFiles();
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
      const _this = this;
      this.sendPost('file/createFile', {name: fileName}, function(response: any){
        _this.loadFiles();
      });
    }
  }

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


  deleteFile(){
    if(confirm('Are you sure you want to delete this file?')) {
      const _this = this;
      this.sendPost('file/deleteFile', {id: this.selectedFile}, function(response: any){
        _this.loadFiles();
      });
    }
  }

  loadFiles() {
    this.http.get<any>('http://localhost:8080/file/getFiles').subscribe((response) => {
      if(response.length > 0) {
        this.selectedFile = response[0].id;
      }
      this.files = response;
    });
  }

  openFile() {
    /*const exists = this.openTabs.find(tab => tab.id === this.selectedFile);

    if(!exists) {
      this.openTabs.push({id: this.selectedFile, name: "a"});
    }*/

    this.loadFile(this.selectedFile);
  }



  loadFile(id: number): void {
    this.loadFileId.emit(id);
  }

  highlightFile(index :number) {
    this.selectedFile = index;
  }
}

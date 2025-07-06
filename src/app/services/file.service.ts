import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private apiService: ApiService) {}

  importFile(file: any, format: string): Observable<any>  {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.apiService.sendPostJson('file/import/' + format, formData);
  }

  deleteFiles(idsFile: number[]): Observable<any> {
    return this.apiService.sendPost('file/deleteFile', {ids: idsFile.join(',')});
  }

  getFiles(): Observable<any> {
    return this.apiService.sendGet('file/getFiles');
  }

  save(idFile: number): Observable<any> {
    return this.apiService.sendPost('file/save', {id: idFile});
  }

  saveAs(idFile: number, name: string): Observable<any> {
    return this.apiService.sendPost('file/saveAs', {id: idFile, name: name});
  }

  newFile(type: string, name: string): Observable<any> {
    return this.apiService.sendPost('file/new', {type: type, name: name});
  }

  export(idFile: number, format: string) {
    window.open('http://localhost:8080/file/export/' + format + '/' + idFile, '_blank')
  }

  cloneFile(idsFile: number[]): Observable<any> {
    return this.apiService.sendPost('file/clone', {ids: idsFile.join(',')});
  }

  renameFile(idFile: number, name: string): Observable<any> {
    return this.apiService.sendPost('file/rename', {id: idFile, name: name});
  }
}

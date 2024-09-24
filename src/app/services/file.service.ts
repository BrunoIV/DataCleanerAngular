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

  createFile(name: string): Observable<any> {
    return this.apiService.sendPost('file/createFile', {name: name});
  }

  deleteFile(id: number): Observable<any> {
    return this.apiService.sendPost('file/deleteFile', {id: id});
  }

  getFiles(): Observable<any> {
    return this.apiService.sendGet('file/getFiles');
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StructureService {

  constructor(private apiService: ApiService) {}

  addRow(position: number, idFile: number): Observable<any>  {
    return this.apiService.sendPost('structure/addRow', {position: position, idFile: idFile});
  }

  addColumn(name: string, position: number, idFile: number): Observable<any>  {
    return this.apiService.sendPost('structure/addColumn', {name: name, position: position, idFile: idFile});
  }

  joinColumns(indexes: string, idFile: number): Observable<any>  {
    return this.apiService.sendPost('structure/joinColumns', {indexes: indexes, idFile: idFile});
  }

  deleteColumns(indexes: string, idFile: number): Observable<any>  {
    return this.apiService.sendPost('structure/deleteColumns', {indexes: indexes, idFile: idFile});
  }

  deleteRows(indexes: string, idFile: number): Observable<any>  {
    return this.apiService.sendPost('structure/deleteRows', { indexes: indexes, idFile: idFile });
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private apiService: ApiService) {}

  getRecords(idFile: number): Observable<any> {
    return this.apiService.sendGet('data/getData/' + idFile);
  }

  modifyValue(param: object) {
    this.apiService.sendPostJson('data/modifyValue', param);
  }

  /**
   * Fills the specified columns with a fixed value
   * @param columns - Array of indexs of columns
   * @param idFile  - ID of file in DB
   * @param newValue - New value for the columns
   * @returns 
   */
  fillFixedValue(columns: number[], idFile: number, newValue: string): Observable<any>  {
    const params = {
      columns: columns.join(','),
      idFile: idFile,
      newValue: newValue
    };

    return this.apiService.sendPost('data/fillFixedValue', params);
  }

  /**
   * Fills the specified columns with an auto-incremental number
   * @param columns - Array of column indices
   * @param idFile  - ID of file in DB
   * @returns 
   */
  fillAutoIncremental(columns: number[], idFile: number): Observable<any>  {
    const params = {
      columns: columns.join(','),
      idFile: idFile
    };

    return this.apiService.sendPost('data/fillAutoIncremental', params);
  }


  validate(columns: number[], idFile: number, functionName: string): Observable<any>  {
    const params = {
      columns: columns.join(','),
      idFile: idFile,
      functionName: 'validate_' + functionName,
    };

    return this.apiService.sendPost('data/validate', params);
  }

  normalize(columns: number[], idFile: number, functionName: string): Observable<any>  {
    const params = {
      columns: columns.join(','),
      idFile: idFile,
      functionName: functionName,
    };

    return this.apiService.sendPost('data/normalize', params);
  }
  
}

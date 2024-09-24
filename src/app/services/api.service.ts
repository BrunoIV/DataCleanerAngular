import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private BASE_URL :string = 'http://localhost:8080/';
  constructor(private http: HttpClient) {}

  sendGet(url: string) {
    return this.http.get<any>(this.BASE_URL + url);
  }

  /**
   * Post request sent as URL-encoded
   * @param url 
   * @param params 
   * @returns 
   */
  sendPost(url: string, params: any): Observable<any> {
    let body = new HttpParams();

    Object.keys(params).forEach(key => {
      body = body.set(key, params[key].toString());
    });

    return this.http.post<any>(this.BASE_URL + url, body);
  }


  /**
   * Post request sent as a JSON instead url-encoded
   * @param url 
   * @param params 
   * @returns 
   */
  sendPostJson(url: string, params: any): Observable<any>{
    return this.http.post<any>(this.BASE_URL + url, params);
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<{ message: string; type: string }>();
  toastState$ = this.toastSubject.asObservable();

  showToast(message: string, type: string) {
    this.toastSubject.next({ message, type });
  }

  success(message: string) {
    this.showToast(message, 'success');
  }

  warning(message: string) {
    this.showToast(message, 'warning');
  }

  error(message: string) {
    this.showToast(message, 'error');
  }
}

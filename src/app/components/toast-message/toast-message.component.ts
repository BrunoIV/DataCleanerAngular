import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'toast-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.css']
})
export class ToastMessageComponent {

  public toasts: { message: string; type: string }[] = [];
  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toasts = [];

    this.toastService.toastState$.subscribe(({ message, type }) => {
      this.toasts.push({message: message, type: type});
      setTimeout(() => this.toasts.shift(), 5000);
    });
  }

  getTop(index:number) {
    return {
      bottom: (index*60) + 'px'
    }
  }
}

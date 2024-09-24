import { Component, Input } from '@angular/core';

@Component({
  selector: 'header-button',
  standalone: true,
  imports: [],
  templateUrl: './header-button.component.html',
  styleUrl: './header-button.component.css'
})
export class HeaderButtonComponent {
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() cssClass: string = '';
}

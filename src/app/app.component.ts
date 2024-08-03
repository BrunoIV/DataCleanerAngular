import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RibbonMenuComponent } from './components/ribbon-menu/ribbon-menu.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RibbonMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  handleButtonClick(buttonId: string): void {
    alert(`Button clicked: ${buttonId}`);
  }
}

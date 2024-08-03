import { Component } from '@angular/core';
import { HeaderButtonComponent } from './../header-button/header-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ribbon-menu',
  standalone: true,
  imports: [CommonModule, HeaderButtonComponent],
  templateUrl: './ribbon-menu.component.html',
  styleUrl: './ribbon-menu.component.css'
})
export class RibbonMenuComponent {
  public menus = [{
    id: 'file',
    title: 'File',
    groups: [{
      title: 'Import',
      items: [{
        icon: 'fa-solid fa-file-csv',
        text: 'CSV'
      },{
        icon: 'fa-brands fa-html5',
        text: 'HTML'
      },{
        icon: 'fa-solid fa-code',
        text: 'XML'
      },{
        icon: 'fa-solid fa-file',
        text: 'JSON'
      },{
        icon: 'fa-solid fa-database',
        text: 'SQL'
      }]
    },{
      title: 'Export',
      items: [{
        icon: 'fa-solid fa-file-csv',
        text: 'CSV'
      },{
        icon: 'fa-brands fa-html5',
        text: 'HTML'
      },{
        icon: 'fa-solid fa-code',
        text: 'XML'
      },{
        icon: 'fa-solid fa-file',
        text: 'JSON'
      },{
        icon: 'fa-solid fa-database',
        text: 'SQL'
      }]
    }]
  },{
    id: 'structure',
    title: 'Structure',
    groups: [{
      title: 'Add column',
      items: [{
        icon: 'fa-solid fa-angles-left',
        text: 'Start'
      },{
        icon: 'fa-solid fa-chevron-left',
        text: 'Left'
      },{
        icon: 'fa-solid fa-chevron-right',
        text: 'Right'
      },{
        icon: 'fa-solid fa-angles-right',
        text: 'End'
      }]
    },{
      title: 'Add row',
      items: [{
        icon: 'fa-solid fa-angles-up',
        text: 'Start'
      },{
        icon: 'fa-solid fa-chevron-up',
        text: 'Up'
      },{
        icon: 'fa-solid fa-chevron-down',
        text: 'Down'
      },{
        icon: 'fa-solid fa-angles-down',
        text: 'End'
      }]
    }]
  }];
}

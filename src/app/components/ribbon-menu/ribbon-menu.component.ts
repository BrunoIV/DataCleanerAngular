import { Component, EventEmitter, Output } from '@angular/core';
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
        text: 'CSV',
        id: 'import_csv'
      },{
        icon: 'fa-solid fa-code',
        text: 'XML',
        id: 'import_xml'
      },{
        icon: 'fa-solid fa-file',
        text: 'JSON',
        id: 'import_json'
      }]
    },{
      title: 'Export',
      items: [{
        icon: 'fa-solid fa-file-csv',
        text: 'CSV',
        id: 'export_csv'
      },{
        icon: 'fa-brands fa-html5',
        text: 'HTML',
        id: 'export_html'
      },{
        icon: 'fa-solid fa-code',
        text: 'XML',
        id: 'export_xml'
      },{
        icon: 'fa-solid fa-file',
        text: 'JSON',
        id: 'export_json'
      },{
        icon: 'fa-solid fa-database',
        text: 'SQL',
        id: 'export_sql'
      }]
    }]
  },{
    id: 'structure',
    title: 'Structure',
    groups: [{
      title: 'Add column',
      items: [{
        icon: 'fa-solid fa-angles-left',
        text: 'Start',
        id: 'add_column_start'
      },{
        icon: 'fa-solid fa-chevron-left',
        text: 'Left',
        id: 'add_column_left'
      },{
        icon: 'fa-solid fa-chevron-right',
        text: 'Right',
        id: 'add_column_right'
      },{
        icon: 'fa-solid fa-angles-right',
        text: 'End',
        id: 'add_column_end'
      }]
    },{
      title: 'Add row',
      items: [{
        icon: 'fa-solid fa-angles-up',
        text: 'Start',
        id: 'add_row_start'
      },{
        icon: 'fa-solid fa-chevron-up',
        text: 'Up',
        id: 'add_row_up'
      },{
        icon: 'fa-solid fa-chevron-down',
        text: 'Down',
        id: 'add_row_down'
      },{
        icon: 'fa-solid fa-angles-down',
        text: 'End',
        id: 'add_row_end'
      }]
    }]
  }];

  @Output() buttonClick = new EventEmitter<string>();
  onButtonClick(id: string): void {
    this.buttonClick.emit(id);
  }
}

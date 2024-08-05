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
    id: 'menu_file',
    title: 'File',
    groups: [{
      title: 'Import',
      items: [{
        icon: 'grid_on',
        text: 'CSV',
        id: 'import_csv'
      },{
        icon: 'code',
        text: 'XML',
        id: 'import_xml'
      },{
        icon: 'data_object',
        text: 'JSON',
        id: 'import_json'
      }]
    },{
      title: 'Export',
      items: [{
        icon: 'grid_on',
        text: 'CSV',
        id: 'export_csv'
      },{
        icon: 'html',
        text: 'HTML',
        id: 'export_html'
      },{
        icon: 'code',
        text: 'XML',
        id: 'export_xml'
      },{
        icon: 'data_object',
        text: 'JSON',
        id: 'export_json'
      },{
        icon: 'database',
        text: 'SQL',
        id: 'export_sql'
      }]
    }]
  },{
    id: 'menu_structure',
    title: 'Structure',
    groups: [{
      title: 'Add column',
      items: [{
        icon: 'arrow_back_ios',
        text: 'Start',
        id: 'add_column_start'
      },{
        icon: 'arrow_forward_ios',
        text: 'Left',
        id: 'add_column_left'
      },{
        icon: 'keyboard_double_arrow_left',
        text: 'Right',
        id: 'add_column_right'
      },{
        icon: 'double_arrow',
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
  },{
    id: 'menu_data',
    title: 'Data',
    groups: [{
      title: 'Normalization',
      items: [{
        icon: 'uppercase',
        text: 'Uppercase',
        id: 'normalization_uppercase'
      },{
        icon: 'lowercase',
        text: 'Lowercase',
        id: 'normalization_lowercase'
      },{
        icon: 'space_bar',
        text: 'Trim',
        id: 'normalization_trim'
      },{
        icon: 'match_case',
        text: 'Capitalize',
        id: 'normalization_captalize'
      }]
    },{
      title: 'Validation',
      items: [{
        icon: 'email',
        text: 'Email',
        id: 'validation_email'
      },{
        icon: 'tag',
        text: 'Number',
        id: 'validation_number'
      },{
        icon: 'serif',
        text: 'Alpha',
        id: 'validation_alpha'
      },{
        icon: 'serif',
        text: 'AlphaNum',
        id: 'validation_alfanumeric'
      }]
    }]
  }];

  @Output() buttonClick = new EventEmitter<string>();
  onButtonClick(id: string): void {
    this.buttonClick.emit(id);
  }
}

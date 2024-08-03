import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonMenuComponent } from './ribbon-menu.component';

describe('RibbonMenuComponent', () => {
  let component: RibbonMenuComponent;
  let fixture: ComponentFixture<RibbonMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RibbonMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RibbonMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
